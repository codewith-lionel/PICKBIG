export type JobStatus =
  | "NEW"
  | "SEEN"
  | "SHORTLISTED"
  | "APPLIED"
  | "REJECTED"
  | "CLOSED"
  | "EXPIRED";

export type FreshnessBucket = "P0" | "P1" | "P2" | "P3" | "UNKNOWN";

export interface JobScoreBreakdown {
  skillMatch: number;
  experienceMatch: number;
  roleMatch: number;
  locationMatch: number;
  educationMatch: number;
  freshnessScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  reason: string;
  recommendation: "STRONG_MATCH" | "GOOD_MATCH" | "WEAK_MATCH" | "REJECT";
}
