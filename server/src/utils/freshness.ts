export type FreshnessLabel = "P0" | "P1" | "P2" | "P3" | "UNKNOWN";

export function classifyFreshness(postedDate?: Date | null, now = new Date()): FreshnessLabel {
  if (!postedDate) {
    return "UNKNOWN";
  }

  const diffMs = now.getTime() - postedDate.getTime();
  const days = diffMs / (1000 * 60 * 60 * 24);

  if (days < 1 / 24) return "P0";
  if (days <= 1) return "P1";
  if (days <= 3) return "P2";
  if (days <= 7) return "P3";
  return "UNKNOWN";
}

export function freshnessWeight(label: FreshnessLabel): number {
  switch (label) {
    case "P0":
      return 100;
    case "P1":
      return 90;
    case "P2":
      return 80;
    case "P3":
      return 70;
    default:
      return 0;
  }
}
