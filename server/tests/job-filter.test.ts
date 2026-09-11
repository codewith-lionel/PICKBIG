import { describe, expect, it } from "vitest";
import { classifyExperienceLevel, isRelevantRole } from "../src/services/jobs/job-filter.service.js";

describe("job experience filter", () => {
  it("rejects senior roles", () => {
    const result = classifyExperienceLevel("Senior role requiring 4+ years");
    expect(result.isFresherFriendly).toBe(false);
  });

  it("accepts fresher roles", () => {
    const result = classifyExperienceLevel("0-1 years, fresher can apply");
    expect(result.isFresherFriendly).toBe(true);
  });

  it("uses semantic matching for role relevance", () => {
    expect(isRelevantRole("Associate Software Engineer", ["React Developer"])).toBe(true);
  });
});
