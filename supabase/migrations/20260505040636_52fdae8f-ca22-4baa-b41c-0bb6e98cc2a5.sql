
-- 1. Remove the public SELECT policy on admin_credentials
DROP POLICY IF EXISTS "Allow login verification" ON public.admin_credentials;

-- 2. Harden ad metric functions: only increment for active ads, prevent self-inflation
CREATE OR REPLACE FUNCTION public.increment_ad_impressions(ad_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE public.advertisements
  SET impressions = impressions + 1
  WHERE id = ad_id
    AND is_active = true
    AND (auth.uid() IS NULL OR user_id <> auth.uid());
END;
$function$;

CREATE OR REPLACE FUNCTION public.increment_ad_clicks(ad_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE public.advertisements
  SET clicks = clicks + 1
  WHERE id = ad_id
    AND is_active = true
    AND (auth.uid() IS NULL OR user_id <> auth.uid());
END;
$function$;
