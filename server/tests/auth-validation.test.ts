import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema } from "../src/validators/auth.validator.js";

describe("auth validation schema", () => {
  it("rejects invalid registration payload", () => {
    expect(() => registerSchema.parse({ body: { email: "bad", password: "123" } })).toThrow();
  });

  it("accepts valid login payload", () => {
    const parsed = loginSchema.parse({ body: { email: "lionel@example.com", password: "password123" } });
    expect(parsed.body.email).toBe("lionel@example.com");
  });
});
