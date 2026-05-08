-- Create article_versions table for storing article draft history
CREATE TABLE public.article_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL DEFAULT 1,
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  excerpt TEXT,
  featured_image_url TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.article_versions ENABLE ROW LEVEL SECURITY;

-- Create policies for article versions
CREATE POLICY "Users can view their own article versions" 
ON public.article_versions 
FOR SELECT 
USING (created_by = auth.uid());

CREATE POLICY "Users can create versions for their own articles" 
ON public.article_versions 
FOR INSERT 
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can delete their own article versions" 
ON public.article_versions 
FOR DELETE 
USING (created_by = auth.uid());

-- Create index for faster lookups
CREATE INDEX idx_article_versions_article_id ON public.article_versions(article_id);
CREATE INDEX idx_article_versions_created_at ON public.article_versions(created_at DESC);