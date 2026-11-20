import { integer, pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const enquiryStatus = pgEnum("enquiry_status", ["new", "contacted", "archived"]);

export const siteContent = pgTable("site_content", {
  id: serial("id").primaryKey(),
  contentKey: varchar("contentKey", { length: 100 }).notNull().unique(),
  contentValue: text("contentValue").notNull(),
  updatedBy: text("updatedBy"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});

export const enquiries = pgTable("enquiries", {
  id: serial("id").primaryKey(),
  parentName: varchar("parentName", { length: 160 }).notNull(),
  phone: varchar("phone", { length: 40 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  studentName: varchar("studentName", { length: 160 }).notNull(),
  studentAge: varchar("studentAge", { length: 32 }).notNull(),
  classApplying: varchar("classApplying", { length: 120 }).notNull(),
  dayBoarding: varchar("dayBoarding", { length: 32 }).notNull(),
  message: text("message").notNull(),
  status: enquiryStatus("status").default("new").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
});

export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 180 }).notNull(),
  excerpt: text("excerpt").notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  published: integer("published").default(0).notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});

export type SiteContent = typeof siteContent.$inferSelect;
export type Enquiry = typeof enquiries.$inferSelect;
export type NewEnquiry = typeof enquiries.$inferInsert;
export type Announcement = typeof announcements.$inferSelect;
