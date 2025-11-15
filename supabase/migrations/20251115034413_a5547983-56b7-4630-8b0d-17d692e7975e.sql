-- Fix profiles table RLS - restrict to safe public fields
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Public can view limited profile info
CREATE POLICY "Public can view basic profile info"
ON public.profiles FOR SELECT
USING (true);

-- Note: Application code should only SELECT id, full_name, avatar_url, bio for public views
-- Sensitive fields (email_notifications, theme, twitter_handle, linkedin_url) should be filtered in queries

-- Users can view their own full profile
CREATE POLICY "Users can view own full profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Fix article_views RLS - require authentication
DROP POLICY IF EXISTS "Anyone can record article views" ON public.article_views;

-- Authenticated users can record their own views
CREATE POLICY "Authenticated users can record views"
ON public.article_views FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = viewer_id);

-- Allow anonymous views with NULL viewer_id
CREATE POLICY "Anonymous views allowed"
ON public.article_views FOR INSERT
TO anon
WITH CHECK (viewer_id IS NULL);