const trackingParams = new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
  "gclid",
  "fbclid",
  "mc_cid",
  "mc_eid"
]);

export function canonicalizeUrl(input: string): string {
  try {
    const url = new URL(input);
    url.hash = "";
    url.searchParams.forEach((_value, key) => {
      if (trackingParams.has(key.toLowerCase())) {
        url.searchParams.delete(key);
      }
    });

    url.hostname = url.hostname.toLowerCase();
    url.pathname = url.pathname.replace(/\/$/, "") || "/";
    return url.toString();
  } catch {
    return input.trim();
  }
}
