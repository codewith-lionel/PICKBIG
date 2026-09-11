import { describe, expect, it } from "vitest";
import { generatedApplicationSchema, scoreSchema } from "../src/ai/schemas.js";

describe("Gemini JSON validation", () => {
  it("accepts valid score JSON", () => {
    const parsed = scoreSchema.parse({
      skillMatch: 85,
      experienceMatch: 75,
      roleMatch: 80,
      locationMatch: 90,
      educationMatch: 70,
      matchingSkills: ["React"],
      missingSkills: ["TypeScript"],
      recommendation: "GOOD_MATCH",
      reason: "Strong frontend alignment"
    });

    expect(parsed.skillMatch).toBe(85);
  });

  it("rejects invalid generated application shape", () => {
    expect(() => generatedApplicationSchema.parse({ coverLetter: "x" })).toThrow();
  });
});
