import { normalizeString } from "../../utils/strings.js";

const fresherKeywords = [
  "fresher",
  "entry",
  "junior",
  "trainee",
  "graduate",
  "0 year",
  "0-1",
  "intern"
];

const rejectKeywords = ["senior", "lead", "staff", "principal", "architect", "manager", "3+", "4+", "5+"];

export function classifyExperienceLevel(experienceRequired?: string | null) {
  const value = normalizeString(experienceRequired ?? "");

  if (!value) {
    return { isFresherFriendly: true, reason: "Experience requirement unavailable" };
  }

  if (rejectKeywords.some((keyword) => value.includes(keyword))) {
    return { isFresherFriendly: false, reason: "Senior experience required" };
  }

  if (fresherKeywords.some((keyword) => value.includes(keyword))) {
    return { isFresherFriendly: true, reason: "Fresher or entry level compatible" };
  }

  return { isFresherFriendly: true, reason: "Potentially compatible" };
}

export function isRelevantRole(title: string, preferredRoles: string[]) {
  const normalizedTitle = normalizeString(title);
  const normalizedRoles = preferredRoles.map((role) => normalizeString(role));

  if (normalizedRoles.some((role) => normalizedTitle.includes(role) || role.includes(normalizedTitle))) {
    return true;
  }

  const semanticKeywords = [
    "software engineer",
    "frontend",
    "full stack",
    "mern",
    "javascript",
    "web developer",
    "application developer"
  ];

  return semanticKeywords.some((keyword) => normalizedTitle.includes(keyword));
}
