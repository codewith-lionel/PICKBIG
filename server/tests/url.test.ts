import { describe, expect, it } from "vitest";
import { canonicalizeUrl } from "../src/utils/url.js";

describe("canonicalizeUrl", () => {
  it("removes tracking parameters", () => {
    const input = "https://example.com/jobs/123?utm_source=abc&ref=home&utm_campaign=x";
    expect(canonicalizeUrl(input)).toBe("https://example.com/jobs/123?ref=home");
  });
});
