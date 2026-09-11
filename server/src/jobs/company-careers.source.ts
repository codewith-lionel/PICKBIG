import type { DiscoveredJob, JobSourceAdapter } from "./job-source.interface.js";

export class CompanyCareersSource implements JobSourceAdapter {
  name = "CompanyCareers";

  async searchJobs(): Promise<DiscoveredJob[]> {
    return [];
  }

  async getJobDetails(): Promise<Partial<DiscoveredJob>> {
    return {};
  }

  async normalizeJob(job: DiscoveredJob): Promise<DiscoveredJob> {
    return job;
  }
}
