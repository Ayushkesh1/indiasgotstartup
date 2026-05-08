-- Migration: Add priority and assignee to contact_queries

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contact_queries' AND column_name = 'priority') THEN
        ALTER TABLE public.contact_queries ADD COLUMN priority TEXT NOT NULL DEFAULT 'normal';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contact_queries' AND column_name = 'assigned_to') THEN
        ALTER TABLE public.contact_queries ADD COLUMN assigned_to UUID REFERENCES public.team_members(id) ON DELETE SET NULL;
    END IF;
END $$;
