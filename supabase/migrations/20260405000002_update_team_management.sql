-- Migration: Add permissions to team_members and create admin_activity_log

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'team_members' AND column_name = 'permissions') THEN
        ALTER TABLE public.team_members ADD COLUMN permissions TEXT[] DEFAULT '{}'::TEXT[];
    END IF;
END $$;

-- Create admin_activity_log table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.admin_activity_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_member_id UUID REFERENCES public.team_members(id) ON DELETE CASCADE,
  action_description TEXT NOT NULL,
  affected_module TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_activity_log ENABLE ROW LEVEL SECURITY;

-- Policies
IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can read activity logs') THEN
    CREATE POLICY "Admins can read activity logs" ON public.admin_activity_log FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
END IF;

IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can insert activity logs') THEN
    CREATE POLICY "Admins can insert activity logs" ON public.admin_activity_log FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
END IF;
