import { createHash } from "node:crypto";
import { canonicalizeUrl } from "./url.js";
import { normalizeString } from "./strings.js";

export function buildJobHash(input: {
  company: string;
  title: string;
  location: string;
  applicationUrl: string;
}) {
  const canonicalUrl = canonicalizeUrl(input.applicationUrl);
  const payload = [
    normalizeString(input.company),
    normalizeString(input.title),
    normalizeString(input.location),
    canonicalUrl
  ].join("|");

  return createHash("sha256").update(payload).digest("hex");
}
