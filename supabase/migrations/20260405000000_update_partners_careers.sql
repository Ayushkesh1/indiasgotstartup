-- Update partners table
ALTER TABLE "public"."partners" 
ADD COLUMN IF NOT EXISTS "revenue_generated" numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS "active_campaigns" integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS "clicks" integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS "conversions" integer DEFAULT 0;

-- Ensure partnership_type is updated if not existing, though it should exist based on frontend.
-- We will just make sure it stays text.

-- Update career_postings table
ALTER TABLE "public"."career_postings"
ADD COLUMN IF NOT EXISTS "status" text DEFAULT 'Open';

-- Optional: Map existing is_active boolean to status
UPDATE "public"."career_postings"
SET "status" = CASE 
    WHEN "is_active" = true THEN 'Open'
    ELSE 'Closed'
END
WHERE "status" IS NULL OR "status" = 'Open';

-- We could drop is_active but it's safer to keep it for backwards compatibility until it's fully migrated.
