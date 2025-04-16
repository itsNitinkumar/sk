ALTER TABLE "doubts" ADD COLUMN "course_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "doubts" ADD CONSTRAINT "doubts_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doubts" DROP COLUMN "content_id";