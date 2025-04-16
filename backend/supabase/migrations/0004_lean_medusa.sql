-- Remove this line since it already exists from 0001_flimsy_mathemanic.sql
-- ALTER TABLE "otps" ADD COLUMN "last_sent" timestamp NOT NULL;

-- Keep only unique alterations
ALTER TABLE "users" ADD COLUMN "refresh_token" text;
