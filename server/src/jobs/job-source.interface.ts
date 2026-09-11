export interface DiscoveredJob {
  company: string;
  title: string;
  location: string;
  source: string;
  sourceUrl: string;
  applicationUrl: string;
  postedDate?: Date | null;
  description?: string;
  technologies?: string[];
  requirements?: string[];
  experienceRequired?: string;
  employmentType?: string;
  companyWebsite?: string;
}

export interface JobSourceAdapter {
  name: string;
  searchJobs(params: { roles: string[]; locations: string[]; remote: boolean }): Promise<DiscoveredJob[]>;
  getJobDetails(sourceUrl: string): Promise<Partial<DiscoveredJob>>;
  normalizeJob(job: DiscoveredJob): Promise<DiscoveredJob>;
}
