import { describe, expect, it } from "vitest";
import { normalizeJob } from "../src/services/jobs/job-normalization.service.js";

describe("normalizeJob", () => {
  it("normalizes strings and creates canonical URL + hash", () => {
    const job = normalizeJob({
      company: " ABC Technologies ",
      title: "React Developer",
      location: "Bengaluru",
      source: "LinkedIn",
      sourceUrl: "https://example.com/jobs/1",
      applicationUrl: "https://example.com/jobs/1?utm_source=feed"
    });

    expect(job.company).toBe("abc technologies");
    expect(job.title).toBe("react developer");
    expect(job.canonicalUrl).toBe("https://example.com/jobs/1");
    expect(job.jobHash.length).toBe(64);
  });
});
