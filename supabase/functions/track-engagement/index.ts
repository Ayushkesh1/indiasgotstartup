import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Base engagement point values
const POINTS = {
  FULL_READ: 1,
  COMMENT: 3,
  BOOKMARK: 2,
  LONG_READ_BONUS: 1,
};

// Follower bonus multiplier (50% extra for follower engagement)
const FOLLOWER_BONUS_MULTIPLIER = 0.5;

// Average reading time threshold for bonus (in seconds)
const AVERAGE_READING_TIME = 180; // 3 minutes

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    const { event_type, article_id, reading_time } = await req.json();

    // Get current month
    const now = new Date();
    const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Get article to find creator and boost status
    const { data: article, error: articleError } = await supabaseClient
      .from('articles')
      .select('author_id, is_boosted, boost_multiplier, boost_expires_at')
      .eq('id', article_id)
      .single();

    if (articleError || !article) {
      return new Response(JSON.stringify({ error: 'Article not found' }), { 
        status: 404, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    // Don't count engagement on own articles
    if (article.author_id === user.id) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Self-engagement not counted' 
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Check for duplicate engagement (except long_read_bonus which can happen once per session)
    if (event_type !== 'long_read_bonus') {
      const { data: existing } = await supabaseClient
        .from('engagement_events')
        .select('id')
        .eq('user_id', user.id)
        .eq('article_id', article_id)
        .eq('event_type', event_type)
        .eq('month_year', monthYear)
        .single();

      if (existing) {
        return new Response(JSON.stringify({ 
          success: true, 
          message: 'Engagement already recorded' 
        }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }

    // Check if user is following the creator (for follower bonus)
    const { data: followData } = await supabaseClient
      .from('follows')
      .select('id')
      .eq('follower_id', user.id)
      .eq('author_id', article.author_id)
      .single();

    const isFollower = !!followData;

    // Check if article is currently boosted
    const isBoosted = article.is_boosted && 
      (!article.boost_expires_at || new Date(article.boost_expires_at) > now);
    const boostMultiplier = isBoosted ? (article.boost_multiplier || 1.5) : 1;

    let basePoints = 0;
    const metadata: Record<string, unknown> = {};

    switch (event_type) {
      case 'full_read':
        basePoints = POINTS.FULL_READ;
        break;
      case 'comment':
        basePoints = POINTS.COMMENT;
        break;
      case 'bookmark':
        basePoints = POINTS.BOOKMARK;
        break;
      case 'long_read_bonus':
        if (reading_time && reading_time > AVERAGE_READING_TIME) {
          basePoints = POINTS.LONG_READ_BONUS;
          metadata.reading_time = reading_time;
        } else {
          return new Response(JSON.stringify({ 
            success: true, 
            message: 'Reading time not long enough for bonus' 
          }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
        break;
      default:
        return new Response(JSON.stringify({ error: 'Invalid event type' }), { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
    }

    // Calculate follower bonus points
    const followerBonusPoints = isFollower ? Math.floor(basePoints * FOLLOWER_BONUS_MULTIPLIER) : 0;
    
    // Apply boost multiplier to total points
    const totalBasePoints = basePoints + followerBonusPoints;
    const finalPoints = Math.round(totalBasePoints * boostMultiplier);

    // Add bonus info to metadata
    if (isFollower) {
      metadata.follower_bonus = followerBonusPoints;
    }
    if (isBoosted) {
      metadata.boost_multiplier = boostMultiplier;
      metadata.boosted = true;
    }

    // Insert engagement event
    const { error: insertError } = await supabaseClient
      .from('engagement_events')
      .insert({
        user_id: user.id,
        article_id: article_id,
        creator_id: article.author_id,
        event_type: event_type,
        points: finalPoints,
        month_year: monthYear,
        is_follower_engagement: isFollower,
        follower_bonus_points: followerBonusPoints,
        metadata: Object.keys(metadata).length > 0 ? metadata : null,
      });

    if (insertError) throw insertError;

    console.log(`Tracked ${event_type} engagement: ${finalPoints} points (base: ${basePoints}, follower bonus: ${followerBonusPoints}, boost: ${boostMultiplier}x) for creator ${article.author_id}`);

    return new Response(JSON.stringify({ 
      success: true, 
      points: finalPoints,
      base_points: basePoints,
      follower_bonus: followerBonusPoints,
      boost_multiplier: boostMultiplier,
      is_follower: isFollower,
      is_boosted: isBoosted,
      message: `Engagement tracked: +${finalPoints} points` 
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
});
