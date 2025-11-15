-- Drop the security definer view and recreate with security_invoker
DROP VIEW IF EXISTS public.comments_public CASCADE;

CREATE OR REPLACE VIEW public.comments_public
WITH (security_invoker=on) AS
SELECT 
  c.id,
  c.article_id,
  c.parent_comment_id,
  c.content,
  c.created_at,
  c.updated_at,
  p.full_name,
  p.avatar_url
FROM public.comments c
LEFT JOIN public.profiles p ON c.user_id = p.id;

-- Grant access to the view
GRANT SELECT ON public.comments_public TO authenticated, anon;

-- Also update the function to not be security definer for the same reason
-- Instead, make sure it respects RLS
DROP FUNCTION IF EXISTS public.get_article_comments(uuid);

CREATE OR REPLACE FUNCTION public.get_article_comments(article_id_param uuid)
RETURNS TABLE (
  id uuid,
  article_id uuid,
  parent_comment_id uuid,
  content text,
  created_at timestamptz,
  updated_at timestamptz,
  full_name text,
  avatar_url text
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT 
    c.id,
    c.article_id,
    c.parent_comment_id,
    c.content,
    c.created_at,
    c.updated_at,
    p.full_name,
    p.avatar_url
  FROM public.comments c
  LEFT JOIN public.profiles p ON c.user_id = p.id
  WHERE c.article_id = article_id_param
  ORDER BY c.created_at ASC;
$$;