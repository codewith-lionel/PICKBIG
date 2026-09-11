import { z } from "zod";

export const searchJobsSchema = z.object({
  body: z.object({
    mode: z.enum(["DISCOVER", "PREPARE", "APPLY"]).default("DISCOVER"),
    role: z.string().optional(),
    location: z.string().optional(),
    remote: z.boolean().optional(),
    source: z.string().optional()
  })
});

export const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(["NEW", "SEEN", "SHORTLISTED", "APPLIED", "REJECTED", "CLOSED", "EXPIRED"])
  }),
  params: z.object({ id: z.string().min(1) })
});

export const idParamSchema = z.object({
  params: z.object({ id: z.string().min(1) })
});
