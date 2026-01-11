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
  LONG_READ_BONUS: 1, // Bonus for reading time above average
};

// Fixed subscription price in INR
const SUBSCRIPTION_PRICE = 100;
const CREATOR_POOL_PERCENTAGE = 0.60;
const PLATFORM_PERCENTAGE = 0.40;
const MIN_PAYOUT_THRESHOLD = 300;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, month_year } = await req.json();

    // Get current month in YYYY-MM format
    const now = new Date();
    const currentMonthYear = month_year || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    console.log(`Processing action: ${action} for month: ${currentMonthYear}`);

    switch (action) {
      case 'calculate_monthly_pool': {
        // Count active subscribers
        const { data: subscriptions, error: subError } = await supabaseClient
          .from('subscriptions')
          .select('id')
          .eq('status', 'active');

        if (subError) throw subError;

        const totalSubscribers = subscriptions?.length || 0;
        const totalRevenue = totalSubscribers * SUBSCRIPTION_PRICE;
        const creatorPool = totalRevenue * CREATOR_POOL_PERCENTAGE;
        const platformRevenue = totalRevenue * PLATFORM_PERCENTAGE;

        // Upsert monthly revenue pool
        const { error: poolError } = await supabaseClient
          .from('monthly_revenue_pools')
          .upsert({
            month_year: currentMonthYear,
            total_subscribers: totalSubscribers,
            total_revenue: totalRevenue,
            creator_pool: creatorPool,
            platform_revenue: platformRevenue,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'month_year' });

        if (poolError) throw poolError;

        console.log(`Monthly pool calculated: ₹${totalRevenue} total, ₹${creatorPool} creator pool`);

        return new Response(JSON.stringify({
          success: true,
          data: {
            month_year: currentMonthYear,
            total_subscribers: totalSubscribers,
            total_revenue: totalRevenue,
            creator_pool: creatorPool,
            platform_revenue: platformRevenue,
          }
        }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      case 'calculate_engagement_points': {
        // Get all engagement events for the month
        const { data: events, error: eventsError } = await supabaseClient
          .from('engagement_events')
          .select('creator_id, event_type, points')
          .eq('month_year', currentMonthYear);

        if (eventsError) throw eventsError;

        // Aggregate points by creator
        const creatorPoints: Record<string, { 
          total: number; 
          full_reads: number; 
          comments: number; 
          bookmarks: number; 
          long_read_bonuses: number; 
        }> = {};

        let totalPoints = 0;

        for (const event of events || []) {
          if (!creatorPoints[event.creator_id]) {
            creatorPoints[event.creator_id] = {
              total: 0,
              full_reads: 0,
              comments: 0,
              bookmarks: 0,
              long_read_bonuses: 0,
            };
          }

          creatorPoints[event.creator_id].total += event.points;
          totalPoints += event.points;

          switch (event.event_type) {
            case 'full_read':
              creatorPoints[event.creator_id].full_reads += 1;
              break;
            case 'comment':
              creatorPoints[event.creator_id].comments += 1;
              break;
            case 'bookmark':
              creatorPoints[event.creator_id].bookmarks += 1;
              break;
            case 'long_read_bonus':
              creatorPoints[event.creator_id].long_read_bonuses += 1;
              break;
          }
        }

        // Get creator pool for this month
        const { data: pool } = await supabaseClient
          .from('monthly_revenue_pools')
          .select('creator_pool')
          .eq('month_year', currentMonthYear)
          .single();

        const creatorPool = pool?.creator_pool || 0;

        // Update creator monthly earnings
        for (const [creatorId, points] of Object.entries(creatorPoints)) {
          const estimatedEarnings = totalPoints > 0 
            ? (points.total / totalPoints) * creatorPool 
            : 0;

          await supabaseClient
            .from('creator_monthly_earnings')
            .upsert({
              creator_id: creatorId,
              month_year: currentMonthYear,
              total_engagement_points: points.total,
              full_reads: points.full_reads,
              comments: points.comments,
              bookmarks: points.bookmarks,
              long_read_bonuses: points.long_read_bonuses,
              estimated_earnings: estimatedEarnings,
              updated_at: new Date().toISOString(),
            }, { onConflict: 'creator_id,month_year' });
        }

        // Update total engagement points in pool
        await supabaseClient
          .from('monthly_revenue_pools')
          .update({ total_engagement_points: totalPoints })
          .eq('month_year', currentMonthYear);

        console.log(`Calculated points for ${Object.keys(creatorPoints).length} creators, total: ${totalPoints}`);

        return new Response(JSON.stringify({
          success: true,
          data: {
            total_points: totalPoints,
            creators_count: Object.keys(creatorPoints).length,
            creator_pool: creatorPool,
          }
        }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      case 'finalize_month': {
        // Get pool and all creator earnings
        const { data: pool, error: poolError } = await supabaseClient
          .from('monthly_revenue_pools')
          .select('*')
          .eq('month_year', currentMonthYear)
          .single();

        if (poolError || !pool) throw poolError || new Error('Pool not found');

        const { data: earnings, error: earningsError } = await supabaseClient
          .from('creator_monthly_earnings')
          .select('*')
          .eq('month_year', currentMonthYear);

        if (earningsError) throw earningsError;

        const totalPoints = pool.total_engagement_points;
        const creatorPool = pool.creator_pool;

        // Calculate and set final earnings
        for (const earning of earnings || []) {
          const finalEarnings = totalPoints > 0 
            ? (earning.total_engagement_points / totalPoints) * creatorPool 
            : 0;

          await supabaseClient
            .from('creator_monthly_earnings')
            .update({ 
              final_earnings: finalEarnings,
              updated_at: new Date().toISOString(),
            })
            .eq('id', earning.id);
        }

        // Mark pool as finalized
        await supabaseClient
          .from('monthly_revenue_pools')
          .update({ 
            is_finalized: true, 
            finalized_at: new Date().toISOString(),
          })
          .eq('month_year', currentMonthYear);

        console.log(`Month ${currentMonthYear} finalized`);

        return new Response(JSON.stringify({
          success: true,
          message: `Month ${currentMonthYear} finalized successfully`,
        }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      case 'get_creator_stats': {
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

        // Get current month earnings
        const { data: currentEarnings } = await supabaseClient
          .from('creator_monthly_earnings')
          .select('*')
          .eq('creator_id', user.id)
          .eq('month_year', currentMonthYear)
          .single();

        // Get last month earnings
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
        const lastMonthYear = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;
        
        const { data: lastMonthEarnings } = await supabaseClient
          .from('creator_monthly_earnings')
          .select('*')
          .eq('creator_id', user.id)
          .eq('month_year', lastMonthYear)
          .single();

        // Get pending balance (unpaid finalized earnings)
        const { data: unpaidEarnings } = await supabaseClient
          .from('creator_monthly_earnings')
          .select('final_earnings')
          .eq('creator_id', user.id)
          .eq('is_paid', false)
          .not('final_earnings', 'is', null);

        const pendingBalance = (unpaidEarnings || []).reduce(
          (sum, e) => sum + (e.final_earnings || 0), 0
        );

        // Get current pool info
        const { data: pool } = await supabaseClient
          .from('monthly_revenue_pools')
          .select('creator_pool, total_engagement_points')
          .eq('month_year', currentMonthYear)
          .single();

        return new Response(JSON.stringify({
          success: true,
          data: {
            current_month: {
              month_year: currentMonthYear,
              engagement_points: currentEarnings?.total_engagement_points || 0,
              full_reads: currentEarnings?.full_reads || 0,
              comments: currentEarnings?.comments || 0,
              bookmarks: currentEarnings?.bookmarks || 0,
              long_read_bonuses: currentEarnings?.long_read_bonuses || 0,
              estimated_earnings: currentEarnings?.estimated_earnings || 0,
            },
            last_month: {
              month_year: lastMonthYear,
              final_earnings: lastMonthEarnings?.final_earnings || 0,
              engagement_points: lastMonthEarnings?.total_engagement_points || 0,
            },
            pending_balance: pendingBalance,
            can_request_payout: pendingBalance >= MIN_PAYOUT_THRESHOLD,
            min_payout_threshold: MIN_PAYOUT_THRESHOLD,
            pool_info: {
              creator_pool: pool?.creator_pool || 0,
              total_engagement_points: pool?.total_engagement_points || 0,
            },
          }
        }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      case 'get_admin_stats': {
        // Get current and previous month pools
        const { data: currentPool } = await supabaseClient
          .from('monthly_revenue_pools')
          .select('*')
          .eq('month_year', currentMonthYear)
          .single();

        // Get all creator earnings for current month
        const { data: allEarnings } = await supabaseClient
          .from('creator_monthly_earnings')
          .select(`
            *,
            profiles:creator_id (full_name, avatar_url)
          `)
          .eq('month_year', currentMonthYear)
          .order('total_engagement_points', { ascending: false });

        // Get pending payouts
        const { data: pendingPayouts } = await supabaseClient
          .from('creator_payouts')
          .select('*')
          .eq('status', 'pending');

        // Get total subscribers
        const { data: activeSubscriptions } = await supabaseClient
          .from('subscriptions')
          .select('id')
          .eq('status', 'active');

        return new Response(JSON.stringify({
          success: true,
          data: {
            current_month: currentMonthYear,
            pool: currentPool || {
              total_subscribers: activeSubscriptions?.length || 0,
              total_revenue: (activeSubscriptions?.length || 0) * SUBSCRIPTION_PRICE,
              creator_pool: (activeSubscriptions?.length || 0) * SUBSCRIPTION_PRICE * CREATOR_POOL_PERCENTAGE,
              platform_revenue: (activeSubscriptions?.length || 0) * SUBSCRIPTION_PRICE * PLATFORM_PERCENTAGE,
              total_engagement_points: 0,
              is_finalized: false,
            },
            creator_earnings: allEarnings || [],
            pending_payouts: pendingPayouts || [],
            total_active_subscribers: activeSubscriptions?.length || 0,
          }
        }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
    }
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
});
