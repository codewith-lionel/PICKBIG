import { describe, expect, it } from "vitest";
import { classifyFreshness } from "../src/utils/freshness.js";

describe("classifyFreshness", () => {
  it("classifies recent jobs into freshness buckets", () => {
    const now = new Date("2026-01-10T12:00:00.000Z");
    expect(classifyFreshness(new Date("2026-01-10T11:50:00.000Z"), now)).toBe("P0");
    expect(classifyFreshness(new Date("2026-01-10T01:00:00.000Z"), now)).toBe("P1");
    expect(classifyFreshness(new Date("2026-01-08T12:00:00.000Z"), now)).toBe("P2");
    expect(classifyFreshness(new Date("2026-01-04T12:00:00.000Z"), now)).toBe("P3");
  });

  it("returns UNKNOWN when date is missing", () => {
    expect(classifyFreshness(null)).toBe("UNKNOWN");
  });
});
