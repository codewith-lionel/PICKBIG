import { z } from "zod";

export const prepareApplicationSchema = z.object({
  body: z.object({
    jobId: z.string().min(1)
  })
});
