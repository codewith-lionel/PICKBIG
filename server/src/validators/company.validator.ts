import { z } from "zod";

export const companySearchSchema = z.object({
  body: z.object({
    company: z.string().min(2)
  })
});
