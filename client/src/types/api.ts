export interface DashboardStats {
  newJobs: number;
  shortlisted: number;
  applied: number;
  rejected: number;
  closed: number;
  strongMatches: number;
  applicationsSent: number;
  jobsDiscovered: number;
}

export interface JobMatch {
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  recommendation: string;
  reason: string;
}

export interface Job {
  id: string;
  company: string;
  title: string;
  location: string;
  source: string;
  postedDate: string | null;
  applicationUrl: string;
  experienceRequired?: string | null;
  status: string;
  matches: JobMatch[];
}

export interface Application {
  id: string;
  status: string;
  coverLetter?: string | null;
  applicationSummary?: string | null;
  generatedAnswers?: Record<string, string>;
  job: Job;
}
