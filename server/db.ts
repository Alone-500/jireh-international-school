import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, announcements, enquiries, siteContent, users, type NewEnquiry } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    if (user[field] !== undefined) {
      const value = user[field] ?? null;
      values[field] = value;
      updateSet[field] = value;
    }
  }
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getSiteContent() {
  const db = await getDb();
  if (!db) return {} as Record<string, string>;
  const rows = await db.select({ key: siteContent.contentKey, value: siteContent.contentValue }).from(siteContent);
  return Object.fromEntries(rows.map((row) => [row.key, row.value]));
}

export async function upsertSiteContent(contentKey: string, contentValue: string, updatedBy: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.insert(siteContent).values({ contentKey, contentValue, updatedBy }).onDuplicateKeyUpdate({ set: { contentValue, updatedBy, updatedAt: new Date() } });
  return { contentKey, contentValue };
}

export async function createEnquiry(input: NewEnquiry) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(enquiries).values(input);
  return { id: Number(result[0].insertId) };
}

export async function listEnquiries() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(enquiries).orderBy(desc(enquiries.createdAt));
}

export async function listAnnouncements(publishedOnly = false) {
  const db = await getDb();
  if (!db) return [];
  const query = db.select().from(announcements);
  if (publishedOnly) return query.where(eq(announcements.published, 1)).orderBy(desc(announcements.createdAt));
  return query.orderBy(desc(announcements.createdAt));
}

export async function createAnnouncement(input: { title: string; excerpt: string; category: string; published: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(announcements).values(input);
  return { id: Number(result[0].insertId) };
}

export async function updateAnnouncement(id: number, input: { title: string; excerpt: string; category: string; published: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(announcements).set({ ...input, updatedAt: new Date() }).where(eq(announcements.id, id));
  return { success: true } as const;
}

export async function deleteAnnouncement(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.delete(announcements).where(eq(announcements.id, id));
  return { success: true } as const;
}
