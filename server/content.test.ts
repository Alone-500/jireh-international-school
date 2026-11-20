import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type TestUser = NonNullable<TrpcContext["user"]>;

function createContext(role: TestUser["role"] = "user"): TrpcContext {
  const user: TestUser = {
    id: "00000000-0000-0000-0000-000000000042",
    email: "content@example.com",
    name: "Content Test User",
    role,
  };
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("public website content boundaries", () => {
  it("blocks non-admin users from editing public content", async () => {
    const caller = appRouter.createCaller(createContext("user"));
    await expect(caller.content.update({ key: "heroTitle", value: "Attempted edit" })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("rejects incomplete admissions enquiries before persistence", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(caller.enquiries.submit({
      parentName: "A",
      phone: "",
      email: "not-an-email",
      studentName: "",
      studentAge: "",
      classApplying: "",
      dayBoarding: "Day",
      message: "",
    })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
