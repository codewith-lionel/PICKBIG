import { freshnessWeight, classifyFreshness } from "../../utils/freshness.js";
import { scoreJob } from "../ai.service.js";

const WEIGHTS = {
  skillMatch: 0.4,
  experienceMatch: 0.2,
  roleMatch: 0.15,
  locationMatch: 0.1,
  educationMatch: 0.05,
  freshnessScore: 0.1
};

export async function calculateJobMatch(input: {
  resumeProfile: Record<string, any>;
  job: Record<string, any>;
}) {
  const freshnessLabel = classifyFreshness(input.job.postedDate ? new Date(input.job.postedDate) : null);

  const aiScore = await scoreJob({
    resumeProfile: input.resumeProfile,
    job: input.job,
    localHints: { freshnessLabel }
  });

  const freshnessScore = freshnessWeight(freshnessLabel);

  const total = Math.round(
    aiScore.skillMatch * WEIGHTS.skillMatch +
      aiScore.experienceMatch * WEIGHTS.experienceMatch +
      aiScore.roleMatch * WEIGHTS.roleMatch +
      aiScore.locationMatch * WEIGHTS.locationMatch +
      aiScore.educationMatch * WEIGHTS.educationMatch +
      freshnessScore * WEIGHTS.freshnessScore
  );

  return {
    matchScore: total,
    freshnessLabel,
    freshnessScore,
    ...aiScore
  };
}
