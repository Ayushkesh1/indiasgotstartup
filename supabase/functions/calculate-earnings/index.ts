import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.1';

Deno.serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get article views from the last 24 hours
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const { data: recentViews, error: viewsError } = await supabaseClient
      .from('article_views')
      .select('article_id, viewer_id')
      .gte('viewed_at', yesterday.toISOString());

    if (viewsError) throw viewsError;

    // Group views by article
    const viewsByArticle = (recentViews || []).reduce((acc: any, view: any) => {
      if (!acc[view.article_id]) {
        acc[view.article_id] = { count: 0, article_id: view.article_id };
      }
      acc[view.article_id].count++;
      return acc;
    }, {});

    // Calculate earnings for each article (e.g., $0.05 per view)
    const earningsRate = 0.05;
    const earningsToCreate = [];

    for (const articleId in viewsByArticle) {
      const viewCount = viewsByArticle[articleId].count;
      const amount = viewCount * earningsRate;

      // Get article author
      const { data: article, error: articleError } = await supabaseClient
        .from('articles')
        .select('author_id')
        .eq('id', articleId)
        .single();

      if (articleError || !article) continue;

      earningsToCreate.push({
        user_id: article.author_id,
        article_id: articleId,
        amount: amount,
        type: 'view',
        description: `Earnings from ${viewCount} views in the last 24 hours`,
        status: 'pending'
      });
    }

    // Insert earnings records
    if (earningsToCreate.length > 0) {
      const { error: insertError } = await supabaseClient
        .from('earnings')
        .insert(earningsToCreate);

      if (insertError) throw insertError;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: earningsToCreate.length,
        message: `Calculated earnings for ${earningsToCreate.length} articles`
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
