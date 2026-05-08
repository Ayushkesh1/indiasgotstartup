-- Add theme preference to profiles
ALTER TABLE public.profiles 
ADD COLUMN theme text DEFAULT 'light' CHECK (theme IN ('light', 'dark'));

-- Create article collaborators table for real-time co-authoring
CREATE TABLE public.article_collaborators (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id uuid NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  permission text NOT NULL DEFAULT 'edit' CHECK (permission IN ('view', 'edit', 'admin')),
  invited_at timestamp with time zone NOT NULL DEFAULT now(),
  accepted_at timestamp with time zone,
  UNIQUE(article_id, user_id)
);

-- Enable RLS on article_collaborators
ALTER TABLE public.article_collaborators ENABLE ROW LEVEL SECURITY;

-- Collaborators can view their invitations
CREATE POLICY "Users can view their collaborations"
ON public.article_collaborators
FOR SELECT
USING (auth.uid() = user_id);

-- Article authors can invite collaborators
CREATE POLICY "Authors can invite collaborators"
ON public.article_collaborators
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.articles
    WHERE articles.id = article_collaborators.article_id
    AND articles.author_id = auth.uid()
  )
);

-- Article authors can remove collaborators
CREATE POLICY "Authors can remove collaborators"
ON public.article_collaborators
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.articles
    WHERE articles.id = article_collaborators.article_id
    AND articles.author_id = auth.uid()
  )
);

-- Users can accept their own invitations
CREATE POLICY "Users can accept collaborations"
ON public.article_collaborators
FOR UPDATE
USING (auth.uid() = user_id);

-- Enable realtime for collaboration
ALTER PUBLICATION supabase_realtime ADD TABLE public.article_collaborators;