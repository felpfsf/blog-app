import { z } from "zod";

export const likeSchema = z.object({
  tweetId: z.string(),
});
