import { likeSchema } from "../../../lib/like.schemas";
import { timelineSchema } from "../../../lib/timeline.schemas";
import { tweetSchema } from "../../../lib/tweet.schemas";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const tweetRouter = createTRPCRouter({
  create: protectedProcedure.input(tweetSchema).mutation(({ ctx, input }) => {
    const { prisma, session } = ctx;
    const { text } = input;

    const userId = session.user.id;

    return prisma.tweet.create({
      data: {
        text,
        author: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }),
  timeline: publicProcedure
    .input(timelineSchema)
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { cursor, limit, where } = input;
      const userId = ctx.session?.user?.id;

      const tweets = await prisma.tweet.findMany({
        take: limit + 1,
        where,
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
        cursor: cursor ? { id: cursor } : undefined,
        include: {
          author: {
            select: {
              id: true,
              image: true,
              name: true,
            },
          },
          likes: {
            where: {
              userId,
            },
            select: {
              userId: true,
            },
          },
          _count: {
            select: {
              likes: true,
            },
          },
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;

      if (tweets.length > limit) {
        const nextItem = tweets.pop() as (typeof tweets)[number];

        nextCursor = nextItem.id;
      }

      return { tweets, nextCursor };
    }),

  like: protectedProcedure
    .input(likeSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { prisma } = ctx;

      const like = prisma.like.create({
        data: {
          tweet: {
            connect: {
              id: input.tweetId,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });

      return like;
    }),

  unlike: protectedProcedure
    .input(likeSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { prisma } = ctx;

      const unlike = prisma.like.delete({
        where: {
          tweetId_userId: {
            tweetId: input.tweetId,
            userId,
          },
        },
      });

      return unlike;
    }),
});
