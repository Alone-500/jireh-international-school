// server/_core/app.ts
import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// server/routers.ts
import { z as z2 } from "zod";
import { TRPCError as TRPCError2 } from "@trpc/server";

// server/_core/systemRouter.ts
import { z } from "zod";

// shared/const.ts
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/_core/trpc.ts
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  }))
});

// server/db.ts
import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// drizzle/schema.ts
import { integer, pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
var enquiryStatus = pgEnum("enquiry_status", ["new", "contacted", "archived"]);
var siteContent = pgTable("site_content", {
  id: serial("id").primaryKey(),
  contentKey: varchar("contentKey", { length: 100 }).notNull().unique(),
  contentValue: text("contentValue").notNull(),
  updatedBy: text("updatedBy"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull()
});
var enquiries = pgTable("enquiries", {
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
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull()
});
var announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 180 }).notNull(),
  excerpt: text("excerpt").notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  published: integer("published").default(0).notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull()
});

// server/db.ts
var _db = null;
var _client = null;
async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _client = postgres(process.env.DATABASE_URL, { prepare: false });
      _db = drizzle(_client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}
async function getSiteContent() {
  const db = await getDb();
  if (!db) return {};
  const rows = await db.select({ key: siteContent.contentKey, value: siteContent.contentValue }).from(siteContent);
  return Object.fromEntries(rows.map((row) => [row.key, row.value]));
}
async function upsertSiteContent(contentKey, contentValue, updatedBy) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.insert(siteContent).values({ contentKey, contentValue, updatedBy }).onConflictDoUpdate({
    target: siteContent.contentKey,
    set: { contentValue, updatedBy, updatedAt: /* @__PURE__ */ new Date() }
  });
  return { contentKey, contentValue };
}
async function createEnquiry(input) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const rows = await db.insert(enquiries).values(input).returning({ id: enquiries.id });
  return { id: rows[0]?.id ?? 0 };
}
async function listEnquiries() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(enquiries).orderBy(desc(enquiries.createdAt));
}
async function listAnnouncements(publishedOnly = false) {
  const db = await getDb();
  if (!db) return [];
  const query = db.select().from(announcements);
  if (publishedOnly) return query.where(eq(announcements.published, 1)).orderBy(desc(announcements.createdAt));
  return query.orderBy(desc(announcements.createdAt));
}
async function createAnnouncement(input) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const rows = await db.insert(announcements).values(input).returning({ id: announcements.id });
  return { id: rows[0]?.id ?? 0 };
}
async function updateAnnouncement(id, input) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(announcements).set({ ...input, updatedAt: /* @__PURE__ */ new Date() }).where(eq(announcements.id, id));
  return { success: true };
}
async function deleteAnnouncement(id) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.delete(announcements).where(eq(announcements.id, id));
  return { success: true };
}

// server/routers.ts
var adminOnlyProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") throw new TRPCError2({ code: "FORBIDDEN", message: "Admin access required" });
  return next({ ctx });
});
var enquiryInput = z2.object({
  parentName: z2.string().trim().min(2).max(160),
  phone: z2.string().trim().min(5).max(40),
  email: z2.string().trim().email().max(320),
  studentName: z2.string().trim().min(2).max(160),
  studentAge: z2.string().trim().min(1).max(32),
  classApplying: z2.string().trim().min(2).max(120),
  dayBoarding: z2.string().trim().min(2).max(32),
  message: z2.string().trim().min(5).max(5e3)
});
var appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(() => {
      return { success: true };
    })
  }),
  content: router({
    getPublic: publicProcedure.query(() => getSiteContent()),
    update: adminOnlyProcedure.input(z2.object({ key: z2.string().trim().min(1).max(100), value: z2.string().trim().min(1).max(5e3) })).mutation(({ ctx, input }) => upsertSiteContent(input.key, input.value, ctx.user.id))
  }),
  enquiries: router({
    submit: publicProcedure.input(enquiryInput).mutation(({ input }) => createEnquiry(input)),
    list: adminOnlyProcedure.query(() => listEnquiries())
  }),
  announcements: router({
    getPublished: publicProcedure.query(() => listAnnouncements(true)),
    list: adminOnlyProcedure.query(() => listAnnouncements(false)),
    create: adminOnlyProcedure.input(z2.object({ title: z2.string().trim().min(2).max(180), excerpt: z2.string().trim().min(5).max(5e3), category: z2.string().trim().min(2).max(80), published: z2.number().int().min(0).max(1) })).mutation(({ input }) => createAnnouncement(input)),
    update: adminOnlyProcedure.input(z2.object({ id: z2.number().int().positive(), title: z2.string().trim().min(2).max(180), excerpt: z2.string().trim().min(5).max(5e3), category: z2.string().trim().min(2).max(80), published: z2.number().int().min(0).max(1) })).mutation(({ input }) => updateAnnouncement(input.id, input)),
    remove: adminOnlyProcedure.input(z2.object({ id: z2.number().int().positive() })).mutation(({ input }) => deleteAnnouncement(input.id))
  })
});

// server/_core/env.ts
var ENV = {
  databaseUrl: process.env.DATABASE_URL ?? "",
  supabaseUrl: process.env.SUPABASE_URL ?? "",
  supabasePublishableKey: process.env.SUPABASE_PUBLISHABLE_KEY ?? "",
  isProduction: process.env.NODE_ENV === "production"
};

// server/_core/context.ts
async function verifySupabaseToken(token) {
  if (!ENV.supabaseUrl || !ENV.supabasePublishableKey) return null;
  try {
    const response = await fetch(`${ENV.supabaseUrl}/auth/v1/user`, {
      headers: {
        apikey: ENV.supabasePublishableKey,
        Authorization: `Bearer ${token}`
      }
    });
    if (!response.ok) return null;
    const data = await response.json();
    const email = String(data?.email ?? "").trim().toLowerCase();
    if (!email) return null;
    return {
      id: String(data?.id ?? email),
      email,
      name: data?.user_metadata?.name ?? data?.user_metadata?.full_name ?? null,
      role: data?.app_metadata?.role === "admin" ? "admin" : "user"
    };
  } catch {
    return null;
  }
}
function extractBearerToken(req) {
  const header = req.headers.authorization;
  if (!header) return null;
  const [scheme, value] = header.split(" ");
  if (!scheme || scheme.toLowerCase() !== "bearer" || !value) return null;
  return value.trim();
}
async function createContext(opts) {
  const token = extractBearerToken(opts.req);
  const user = token ? await verifySupabaseToken(token) : null;
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/_core/app.ts
function createApp() {
  const app2 = express();
  app2.use(express.json({ limit: "50mb" }));
  app2.use(express.urlencoded({ limit: "50mb", extended: true }));
  const middleware = createExpressMiddleware({
    router: appRouter,
    createContext
  });
  app2.use("/api/trpc", middleware);
  app2.use("/trpc", middleware);
  return app2;
}

// server/vercel-entrypoint.ts
var app = null;
var bootError = null;
try {
  app = createApp();
} catch (e) {
  console.error("[api] boot failed:", e);
  bootError = e;
}
function toExpressUrl(rawUrl) {
  try {
    const url = new URL(rawUrl ?? "/", "http://localhost");
    const apiPath = url.searchParams.get("__apiPath");
    if (!apiPath) return rawUrl ?? "/";
    url.searchParams.delete("__apiPath");
    const rest = url.searchParams.toString();
    return "/api/" + apiPath + (rest ? "?" + rest : "");
  } catch {
    return "/";
  }
}
function handler(req, res) {
  if (bootError) {
    res.statusCode = 500;
    res.setHeader("content-type", "text/plain; charset=utf-8");
    res.end(`Server error: ${bootError.name}: ${bootError.message}`);
    return;
  }
  req.url = toExpressUrl(req.url);
  return app(req, res);
}
export {
  handler as default
};
