-- Create newsletter_campaigns table
CREATE TABLE IF NOT EXISTS public.newsletter_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  target_segment TEXT NOT NULL DEFAULT 'all',
  sent_at TIMESTAMP WITH TIME ZONE,
  open_rate NUMERIC(5,2) DEFAULT 0.00,
  click_rate NUMERIC(5,2) DEFAULT 0.00,
  unsubscribe_rate NUMERIC(5,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.newsletter_campaigns ENABLE ROW LEVEL SECURITY;

-- Policies
IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can view campaigns') THEN
    CREATE POLICY "Admins can view campaigns" ON public.newsletter_campaigns FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
END IF;

IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage campaigns') THEN
    CREATE POLICY "Admins can manage campaigns" ON public.newsletter_campaigns FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
END IF;

-- Trigger for updated_at
CREATE TRIGGER update_newsletter_campaigns_updated_at BEFORE UPDATE ON public.newsletter_campaigns FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
