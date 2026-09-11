import { describe, expect, it } from "vitest";
import { buildJobHash } from "../src/utils/hash.js";

describe("buildJobHash", () => {
  it("creates stable hash from normalized job fields", () => {
    const a = buildJobHash({
      company: "ABC Technologies",
      title: "React Developer",
      location: "Bengaluru",
      applicationUrl: "https://abc.com/jobs?id=10&utm_source=google"
    });

    const b = buildJobHash({
      company: "abc technologies",
      title: "react developer",
      location: "bengaluru",
      applicationUrl: "https://abc.com/jobs?id=10"
    });

    expect(a).toBe(b);
  });
});
