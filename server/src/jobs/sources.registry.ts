import { CompanyCareersSource } from "./company-careers.source.js";
import type { JobSourceAdapter } from "./job-source.interface.js";

export function getEnabledSources(): JobSourceAdapter[] {
  return [new CompanyCareersSource()];
}
