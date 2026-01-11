-- Add boost system to articles
ALTER TABLE public.articles 
ADD COLUMN IF NOT EXISTS is_boosted boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS boost_multiplier numeric NOT NULL DEFAULT 1.0,
ADD COLUMN IF NOT EXISTS boosted_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS boost_expires_at timestamp with time zone;

-- Add follower bonus tracking to engagement_events
ALTER TABLE public.engagement_events 
ADD COLUMN IF NOT EXISTS is_follower_engagement boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS follower_bonus_points integer NOT NULL DEFAULT 0;

-- Add follower bonus fields to creator_monthly_earnings
ALTER TABLE public.creator_monthly_earnings 
ADD COLUMN IF NOT EXISTS follower_engagements integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS follower_bonus_points integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS boosted_article_points integer NOT NULL DEFAULT 0;

-- Create index for boosted articles
CREATE INDEX IF NOT EXISTS idx_articles_boosted ON public.articles(is_boosted) WHERE is_boosted = true;

-- Create index for follower engagements
CREATE INDEX IF NOT EXISTS idx_engagement_follower ON public.engagement_events(is_follower_engagement) WHERE is_follower_engagement = true;