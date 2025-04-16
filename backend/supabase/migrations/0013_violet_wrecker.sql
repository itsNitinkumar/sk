ALTER TABLE "classes" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "classes" CASCADE;--> statement-breakpoint
ALTER TABLE "doubts" DROP CONSTRAINT "doubts_class_id_classes_id_fk";
--> statement-breakpoint
ALTER TABLE "category" ALTER COLUMN "description" SET DEFAULT 'No description provided';--> statement-breakpoint
ALTER TABLE "content" ALTER COLUMN "order" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "content" ALTER COLUMN "order" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "content" ALTER COLUMN "views" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "content" ALTER COLUMN "duration" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "content" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "content" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "doubts" ADD CONSTRAINT "doubts_class_id_content_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."content"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content" DROP COLUMN "is_dismissed";--> statement-breakpoint
ALTER TABLE "content" DROP COLUMN "dismiss_reason";--> statement-breakpoint
ALTER TABLE "content" DROP COLUMN "dismissed_at";--> statement-breakpoint
ALTER TABLE "content" DROP COLUMN "view_count";--> statement-breakpoint
ALTER TABLE "content" DROP COLUMN "time_spent";