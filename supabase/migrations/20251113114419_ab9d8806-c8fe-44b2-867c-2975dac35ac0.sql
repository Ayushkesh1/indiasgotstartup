-- Create tags table
CREATE TABLE public.tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create article_tags junction table
CREATE TABLE public.article_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(article_id, tag_id)
);

-- Enable Row Level Security
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_tags ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tags
CREATE POLICY "Tags are viewable by everyone"
  ON public.tags
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create tags"
  ON public.tags
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for article_tags
CREATE POLICY "Article tags are viewable by everyone"
  ON public.article_tags
  FOR SELECT
  USING (true);

CREATE POLICY "Authors can add tags to their articles"
  ON public.article_tags
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.articles
      WHERE articles.id = article_tags.article_id
      AND articles.author_id = auth.uid()
    )
  );

CREATE POLICY "Authors can remove tags from their articles"
  ON public.article_tags
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.articles
      WHERE articles.id = article_tags.article_id
      AND articles.author_id = auth.uid()
    )
  );