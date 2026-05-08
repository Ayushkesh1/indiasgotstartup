-- Create a view for comments that doesn't expose user_ids directly
CREATE OR REPLACE VIEW public.comments_public AS
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

-- Create a function to get comments without exposing user_ids
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
SECURITY DEFINER
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