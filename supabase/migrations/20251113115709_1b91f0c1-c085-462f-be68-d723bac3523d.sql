-- Create article_series table for grouping related articles
CREATE TABLE public.article_series (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  author_id UUID NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create series_articles junction table
CREATE TABLE public.series_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  series_id UUID NOT NULL REFERENCES public.article_series(id) ON DELETE CASCADE,
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(series_id, article_id),
  UNIQUE(series_id, position)
);

-- Enable Row Level Security
ALTER TABLE public.article_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.series_articles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for article_series
CREATE POLICY "Series are viewable by everyone"
  ON public.article_series
  FOR SELECT
  USING (true);

CREATE POLICY "Authors can create their own series"
  ON public.article_series
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own series"
  ON public.article_series
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their own series"
  ON public.article_series
  FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- RLS Policies for series_articles
CREATE POLICY "Series articles are viewable by everyone"
  ON public.series_articles
  FOR SELECT
  USING (true);

CREATE POLICY "Authors can add articles to their series"
  ON public.series_articles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.article_series
      WHERE article_series.id = series_articles.series_id
      AND article_series.author_id = auth.uid()
    )
  );

CREATE POLICY "Authors can remove articles from their series"
  ON public.series_articles
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.article_series
      WHERE article_series.id = series_articles.series_id
      AND article_series.author_id = auth.uid()
    )
  );

-- Create reading_progress table for syncing across devices
CREATE TABLE public.reading_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  scroll_position NUMERIC NOT NULL DEFAULT 0,
  progress_percentage NUMERIC NOT NULL DEFAULT 0,
  last_read_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, article_id)
);

-- Enable Row Level Security
ALTER TABLE public.reading_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reading_progress
CREATE POLICY "Users can view their own reading progress"
  ON public.reading_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reading progress"
  ON public.reading_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reading progress"
  ON public.reading_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_article_series_updated_at
  BEFORE UPDATE ON public.article_series
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();