SET timezone = 'America/Santiago';
ALTER TABLE "liveness" ALTER COLUMN "initialDate" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "liveness" ALTER COLUMN "finishDate" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "birthDate" SET DATA TYPE timestamp with time zone;