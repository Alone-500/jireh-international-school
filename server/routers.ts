import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { createAnnouncement, createEnquiry, deleteAnnouncement, getSiteContent, listAnnouncements, listEnquiries, updateAnnouncement, upsertSiteContent } from "./db";

const adminOnlyProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  return next({ ctx });
});

const enquiryInput = z.object({
  parentName: z.string().trim().min(2).max(160),
  phone: z.string().trim().min(5).max(40),
  email: z.string().trim().email().max(320),
  studentName: z.string().trim().min(2).max(160),
  studentAge: z.string().trim().min(1).max(32),
  classApplying: z.string().trim().min(2).max(120),
  dayBoarding: z.string().trim().min(2).max(32),
  message: z.string().trim().min(5).max(5000),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  content: router({
    getPublic: publicProcedure.query(() => getSiteContent()),
    update: adminOnlyProcedure.input(z.object({ key: z.string().trim().min(1).max(100), value: z.string().trim().min(1).max(5000) })).mutation(({ ctx, input }) => upsertSiteContent(input.key, input.value, ctx.user.id)),
  }),
  enquiries: router({
    submit: publicProcedure.input(enquiryInput).mutation(({ input }) => createEnquiry(input)),
    list: adminOnlyProcedure.query(() => listEnquiries()),
  }),
  announcements: router({
    getPublished: publicProcedure.query(() => listAnnouncements(true)),
    list: adminOnlyProcedure.query(() => listAnnouncements(false)),
    create: adminOnlyProcedure.input(z.object({ title: z.string().trim().min(2).max(180), excerpt: z.string().trim().min(5).max(5000), category: z.string().trim().min(2).max(80), published: z.number().int().min(0).max(1) })).mutation(({ input }) => createAnnouncement(input)),
    update: adminOnlyProcedure.input(z.object({ id: z.number().int().positive(), title: z.string().trim().min(2).max(180), excerpt: z.string().trim().min(5).max(5000), category: z.string().trim().min(2).max(80), published: z.number().int().min(0).max(1) })).mutation(({ input }) => updateAnnouncement(input.id, input)),
    remove: adminOnlyProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => deleteAnnouncement(input.id)),
  }),
});

export type AppRouter = typeof appRouter;
