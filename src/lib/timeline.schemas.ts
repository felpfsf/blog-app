import { z } from "zod";

export const timelineSchema = z.object({
  cursor: z.string().nullish(),
  limit: z.number().min(1).max(100).default(10),
  where: z
    .object({
      author: z
        .object({
          name: z.string().optional(),
        })
        .optional(),
    })
    .optional()
    .optional(),
});
