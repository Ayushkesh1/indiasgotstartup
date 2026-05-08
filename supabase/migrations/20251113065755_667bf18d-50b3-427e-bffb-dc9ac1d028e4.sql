-- Create enum for article categories
CREATE TYPE public.article_category AS ENUM (
  'Fintech',
  'Tech',
  'Blockchain',
  'eCommerce',
  'Government',
  'Edtech',
  'Funding',
  'Mobility'
);

-- Update articles table to use the enum
ALTER TABLE public.articles 
  ALTER COLUMN category TYPE public.article_category USING category::public.article_category;

-- Create advertisements table
CREATE TABLE public.advertisements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT NOT NULL,
  bid_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT false,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  impressions INTEGER NOT NULL DEFAULT 0,
  clicks INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on advertisements
ALTER TABLE public.advertisements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for advertisements
CREATE POLICY "Active advertisements are viewable by everyone"
  ON public.advertisements
  FOR SELECT
  USING (is_active = true AND (start_date IS NULL OR start_date <= now()) AND (end_date IS NULL OR end_date >= now()));

CREATE POLICY "Users can view their own advertisements"
  ON public.advertisements
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own advertisements"
  ON public.advertisements
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own advertisements"
  ON public.advertisements
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own advertisements"
  ON public.advertisements
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger for updated_at on advertisements
CREATE TRIGGER update_advertisements_updated_at
  BEFORE UPDATE ON public.advertisements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_advertisements_user_id ON public.advertisements(user_id);
CREATE INDEX idx_advertisements_active ON public.advertisements(is_active);
CREATE INDEX idx_advertisements_dates ON public.advertisements(start_date, end_date);