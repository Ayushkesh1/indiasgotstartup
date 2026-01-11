import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Engagement point values
const POINTS = {
  FULL_READ: 1,
  COMMENT: 3,
  BOOKMARK: 2,
  LONG_READ_BONUS: 1,
};

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

    // Get article to find creator
    const { data: article, error: articleError } = await supabaseClient
      .from('articles')
      .select('author_id')
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

    let points = 0;
    const metadata: Record<string, unknown> = {};

    switch (event_type) {
      case 'full_read':
        points = POINTS.FULL_READ;
        break;
      case 'comment':
        points = POINTS.COMMENT;
        break;
      case 'bookmark':
        points = POINTS.BOOKMARK;
        break;
      case 'long_read_bonus':
        if (reading_time && reading_time > AVERAGE_READING_TIME) {
          points = POINTS.LONG_READ_BONUS;
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

    // Insert engagement event
    const { error: insertError } = await supabaseClient
      .from('engagement_events')
      .insert({
        user_id: user.id,
        article_id: article_id,
        creator_id: article.author_id,
        event_type: event_type,
        points: points,
        month_year: monthYear,
        metadata: Object.keys(metadata).length > 0 ? metadata : null,
      });

    if (insertError) throw insertError;

    console.log(`Tracked ${event_type} engagement: ${points} points for creator ${article.author_id}`);

    return new Response(JSON.stringify({ 
      success: true, 
      points: points,
      message: `Engagement tracked: +${points} points` 
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
