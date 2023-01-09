import { z } from "zod";
export const tweetSchema = z.object({
  text: z
    .string({ required_error: "A message is required" })
    .min(10, "Tweet must be at least 10 characters")
    .max(280),
});

export type Tweet = z.infer<typeof tweetSchema>;
