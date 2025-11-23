-- Add points_redeemed column to payouts table
ALTER TABLE public.payouts 
ADD COLUMN IF NOT EXISTS points_redeemed integer DEFAULT 0;