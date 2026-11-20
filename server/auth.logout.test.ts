import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AdminUser = NonNullable<TrpcContext["user"]>;

function createContext(user: AdminUser | null): TrpcContext {
  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

const adminUser: AdminUser = {
  id: "00000000-0000-0000-0000-000000000001",
  email: "owner@example.com",
  name: "Owner",
  role: "admin",
};

describe("auth", () => {
  it("auth.me returns the authenticated user", async () => {
    const caller = appRouter.createCaller(createContext(adminUser));
    expect(await caller.auth.me()).toEqual(adminUser);
  });

  it("auth.me returns null when not authenticated", async () => {
    const caller = appRouter.createCaller(createContext(null));
    expect(await caller.auth.me()).toBeNull();
  });

  it("auth.logout reports success (client-side Supabase sign out)", async () => {
    const caller = appRouter.createCaller(createContext(adminUser));
    expect(await caller.auth.logout()).toEqual({ success: true });
  });

  it("admin-only procedures reject regular signed-in users", async () => {
    const caller = appRouter.createCaller(createContext({ ...adminUser, role: "user" }));
    await expect(caller.enquiries.list()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("admin-only procedures reject anonymous callers", async () => {
    const caller = appRouter.createCaller(createContext(null));
    await expect(caller.enquiries.list()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});
