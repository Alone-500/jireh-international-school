CREATE TYPE "public"."enquiry_status" AS ENUM('new', 'contacted', 'archived');--> statement-breakpoint
CREATE TABLE "announcements" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(180) NOT NULL,
	"excerpt" text NOT NULL,
	"category" varchar(80) NOT NULL,
	"published" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "enquiries" (
	"id" serial PRIMARY KEY NOT NULL,
	"parentName" varchar(160) NOT NULL,
	"phone" varchar(40) NOT NULL,
	"email" varchar(320) NOT NULL,
	"studentName" varchar(160) NOT NULL,
	"studentAge" varchar(32) NOT NULL,
	"classApplying" varchar(120) NOT NULL,
	"dayBoarding" varchar(32) NOT NULL,
	"message" text NOT NULL,
	"status" "enquiry_status" DEFAULT 'new' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_content" (
	"id" serial PRIMARY KEY NOT NULL,
	"contentKey" varchar(100) NOT NULL,
	"contentValue" text NOT NULL,
	"updatedBy" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "site_content_contentKey_unique" UNIQUE("contentKey")
);
