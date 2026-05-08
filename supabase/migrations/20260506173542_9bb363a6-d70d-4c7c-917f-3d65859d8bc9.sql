
-- 1. team_members: remove public SELECT (exposes emails). Admins still have ALL via existing policy.
DROP POLICY IF EXISTS "Active team members are viewable by everyone" ON public.team_members;

-- Create a public view that excludes email
CREATE OR REPLACE VIEW public.team_members_public
WITH (security_invoker = true) AS
SELECT id, name, role, department, bio, image_url,
       linkedin_url, twitter_handle, display_order, is_active,
       created_at, updated_at
FROM public.team_members
WHERE is_active = true;

GRANT SELECT ON public.team_members_public TO anon, authenticated;

-- Allow public SELECT on the view's underlying rows by adding a policy that EXCLUDES email
-- via a permissive SELECT for non-admins on the table is risky; instead rely on the view+invoker
-- requires a SELECT policy that lets active rows through. Keep admin policy and add a narrow one
-- that the view depends on. Since security_invoker=true, the caller's permissions apply.
CREATE POLICY "Active team members visible to all (no email)"
ON public.team_members
FOR SELECT
TO anon, authenticated
USING (is_active = true);
-- NOTE: column-level grants protect the email column from non-admins.
REVOKE SELECT ON public.team_members FROM anon, authenticated;
GRANT SELECT (id, name, role, department, bio, image_url, linkedin_url,
              twitter_handle, display_order, is_active, created_at, updated_at)
  ON public.team_members TO anon, authenticated;
GRANT SELECT (email) ON public.team_members TO authenticated;
-- Email column SELECT only granted to authenticated; admin policy still covers full ALL.
-- To restrict email strictly to admins, revoke from authenticated as well:
REVOKE SELECT (email) ON public.team_members FROM authenticated;

-- 2. earnings: remove user INSERT policy
DROP POLICY IF EXISTS "Users can insert their own earnings" ON public.earnings;

-- 3. payouts: remove user UPDATE policy (admins still implicit via service role / future admin policy)
DROP POLICY IF EXISTS "Users can update their own payouts" ON public.payouts;

CREATE POLICY "Admins can update payouts"
ON public.payouts
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all payouts"
ON public.payouts
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 4. Remove article_collaborators from realtime publication to prevent broadcast leaks
ALTER PUBLICATION supabase_realtime DROP TABLE public.article_collaborators;

-- 5. storage: tighten article-images INSERT to require a folder matching the user's UID
DROP POLICY IF EXISTS "Authenticated users can upload article images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload article images" ON storage.objects;

CREATE POLICY "Users can upload article images to their own folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'article-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
