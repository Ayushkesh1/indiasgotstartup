-- Subscriptions table (₹100/month fixed price)
CREATE TABLE public.subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  payment_method TEXT, -- upi, bank_transfer
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Monthly revenue pools
CREATE TABLE public.monthly_revenue_pools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  month_year TEXT NOT NULL UNIQUE, -- Format: '2025-01'
  total_subscribers INTEGER NOT NULL DEFAULT 0,
  total_revenue NUMERIC NOT NULL DEFAULT 0, -- Total ₹100 × subscribers
  creator_pool NUMERIC NOT NULL DEFAULT 0, -- 60% of total
  platform_revenue NUMERIC NOT NULL DEFAULT 0, -- 40% of total
  total_engagement_points NUMERIC NOT NULL DEFAULT 0,
  is_finalized BOOLEAN NOT NULL DEFAULT false,
  finalized_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Engagement events tracking
CREATE TABLE public.engagement_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL, -- The user who engaged
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL, -- The article author
  event_type TEXT NOT NULL CHECK (event_type IN ('full_read', 'comment', 'bookmark', 'long_read_bonus')),
  points INTEGER NOT NULL,
  month_year TEXT NOT NULL, -- Format: '2025-01'
  metadata JSONB, -- Store reading time, etc.
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Creator monthly earnings
CREATE TABLE public.creator_monthly_earnings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID NOT NULL,
  month_year TEXT NOT NULL, -- Format: '2025-01'
  total_engagement_points NUMERIC NOT NULL DEFAULT 0,
  full_reads INTEGER NOT NULL DEFAULT 0,
  comments INTEGER NOT NULL DEFAULT 0,
  bookmarks INTEGER NOT NULL DEFAULT 0,
  long_read_bonuses INTEGER NOT NULL DEFAULT 0,
  estimated_earnings NUMERIC NOT NULL DEFAULT 0,
  final_earnings NUMERIC, -- Set when month is finalized
  is_paid BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(creator_id, month_year)
);

-- Creator payout requests
CREATE TABLE public.creator_payouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  payment_method TEXT NOT NULL, -- upi, bank_transfer
  payment_details JSONB, -- UPI ID or bank details
  transaction_id TEXT,
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Creator payment info (UPI/Bank details)
CREATE TABLE public.creator_payment_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID NOT NULL UNIQUE,
  upi_id TEXT,
  bank_account_number TEXT,
  bank_ifsc TEXT,
  bank_account_name TEXT,
  preferred_method TEXT DEFAULT 'upi',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_revenue_pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.engagement_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_monthly_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_payment_info ENABLE ROW LEVEL SECURITY;

-- Subscriptions policies
CREATE POLICY "Users can view their own subscription" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own subscription" ON public.subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all subscriptions" ON public.subscriptions FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update subscriptions" ON public.subscriptions FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

-- Monthly revenue pools policies (admin only for viewing)
CREATE POLICY "Admins can view revenue pools" ON public.monthly_revenue_pools FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage revenue pools" ON public.monthly_revenue_pools FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Engagement events policies
CREATE POLICY "Users can create engagement events" ON public.engagement_events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Creators can view engagement on their articles" ON public.engagement_events FOR SELECT USING (auth.uid() = creator_id);
CREATE POLICY "Admins can view all engagement" ON public.engagement_events FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Creator monthly earnings policies
CREATE POLICY "Creators can view their own earnings" ON public.creator_monthly_earnings FOR SELECT USING (auth.uid() = creator_id);
CREATE POLICY "Admins can view all earnings" ON public.creator_monthly_earnings FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage earnings" ON public.creator_monthly_earnings FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Creator payouts policies
CREATE POLICY "Creators can view their own payouts" ON public.creator_payouts FOR SELECT USING (auth.uid() = creator_id);
CREATE POLICY "Creators can request payouts" ON public.creator_payouts FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Admins can view all payouts" ON public.creator_payouts FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update payouts" ON public.creator_payouts FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

-- Creator payment info policies
CREATE POLICY "Creators can view their own payment info" ON public.creator_payment_info FOR SELECT USING (auth.uid() = creator_id);
CREATE POLICY "Creators can manage their payment info" ON public.creator_payment_info FOR ALL USING (auth.uid() = creator_id);
CREATE POLICY "Admins can view payment info" ON public.creator_payment_info FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for performance
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX idx_engagement_events_creator ON public.engagement_events(creator_id, month_year);
CREATE INDEX idx_engagement_events_article ON public.engagement_events(article_id);
CREATE INDEX idx_creator_earnings_month ON public.creator_monthly_earnings(month_year);
CREATE INDEX idx_creator_payouts_status ON public.creator_payouts(status);

-- Triggers for updated_at
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_revenue_pools_updated_at BEFORE UPDATE ON public.monthly_revenue_pools FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_creator_earnings_updated_at BEFORE UPDATE ON public.creator_monthly_earnings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_creator_payouts_updated_at BEFORE UPDATE ON public.creator_payouts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_payment_info_updated_at BEFORE UPDATE ON public.creator_payment_info FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();