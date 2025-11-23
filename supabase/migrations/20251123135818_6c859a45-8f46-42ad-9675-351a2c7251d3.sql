-- Create article_reports table for content flagging
CREATE TABLE IF NOT EXISTS public.article_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid REFERENCES public.articles(id) ON DELETE CASCADE NOT NULL,
  reporter_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reason text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'pending',
  reviewed_by uuid REFERENCES auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.article_reports ENABLE ROW LEVEL SECURITY;

-- RLS policies for article_reports
CREATE POLICY "Users can report articles"
ON public.article_reports FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view their own reports"
ON public.article_reports FOR SELECT
TO authenticated
USING (auth.uid() = reporter_id);

CREATE POLICY "Admins can view all reports"
ON public.article_reports FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update reports"
ON public.article_reports FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Add points column to earnings table
ALTER TABLE public.earnings 
ADD COLUMN IF NOT EXISTS points integer DEFAULT 0;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_article_reports_status ON public.article_reports(status);
CREATE INDEX IF NOT EXISTS idx_article_reports_article_id ON public.article_reports(article_id);

-- Update trigger for article_reports
CREATE TRIGGER update_article_reports_updated_at
BEFORE UPDATE ON public.article_reports
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();