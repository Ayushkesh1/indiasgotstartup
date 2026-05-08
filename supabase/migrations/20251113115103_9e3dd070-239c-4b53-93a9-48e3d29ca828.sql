-- Create comment_votes table for upvoting comments
CREATE TABLE public.comment_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(comment_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.comment_votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for comment_votes
CREATE POLICY "Comment votes are viewable by everyone"
  ON public.comment_votes
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can vote on comments"
  ON public.comment_votes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own votes"
  ON public.comment_votes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create article_views table for tracking views over time
CREATE TABLE public.article_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  viewer_id UUID,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.article_views ENABLE ROW LEVEL SECURITY;

-- RLS Policy for article_views
CREATE POLICY "Anyone can record article views"
  ON public.article_views
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authors can view their article analytics"
  ON public.article_views
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.articles
      WHERE articles.id = article_views.article_id
      AND articles.author_id = auth.uid()
    )
  );

-- Create function to get comment vote count
CREATE OR REPLACE FUNCTION public.get_comment_vote_count(comment_id_param UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.comment_votes
  WHERE comment_id = comment_id_param;
$$;