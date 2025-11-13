-- Create RPC functions for tracking ad metrics
CREATE OR REPLACE FUNCTION public.increment_ad_impressions(ad_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.advertisements
  SET impressions = impressions + 1
  WHERE id = ad_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_ad_clicks(ad_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.advertisements
  SET clicks = clicks + 1
  WHERE id = ad_id;
END;
$$;