import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { announcements, enquiries, siteContent, type NewEnquiry } from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;
let _client: ReturnType<typeof postgres> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      // prepare:false keeps the same code path working for the direct (5432)
      // connection and the transaction pooler (6543) used serverlessly.
      _client = postgres(process.env.DATABASE_URL, { prepare: false });
      _db = drizzle(_client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function getSiteContent() {
  const db = await getDb();
  if (!db) return {} as Record<string, string>;
  const rows = await db.select({ key: siteContent.contentKey, value: siteContent.contentValue }).from(siteContent);
  return Object.fromEntries(rows.map((row) => [row.key, row.value]));
}

export async function upsertSiteContent(contentKey: string, contentValue: string, updatedBy: string) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db
    .insert(siteContent)
    .values({ contentKey, contentValue, updatedBy })
    .onConflictDoUpdate({
      target: siteContent.contentKey,
      set: { contentValue, updatedBy, updatedAt: new Date() },
    });
  return { contentKey, contentValue };
}

export async function createEnquiry(input: NewEnquiry) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const rows = await db.insert(enquiries).values(input).returning({ id: enquiries.id });
  return { id: rows[0]?.id ?? 0 };
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
  const rows = await db.insert(announcements).values(input).returning({ id: announcements.id });
  return { id: rows[0]?.id ?? 0 };
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
