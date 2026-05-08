-- Update the comments_public view to include an is_owner field
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
  p.avatar_url,
  CASE 
    WHEN auth.uid() = c.user_id THEN true 
    ELSE false 
  END AS is_owner
FROM public.comments c
LEFT JOIN public.profiles p ON c.user_id = p.id;

-- Grant access to the view
GRANT SELECT ON public.comments_public TO authenticated, anon;