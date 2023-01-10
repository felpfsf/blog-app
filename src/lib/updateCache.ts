import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import type { RouterInputs, RouterOutputs } from "../utils/api";


interface UpdateCacheProps {
  client: QueryClient;
  variables: {
    tweetId: string;
  };
  data: {
    userId: string;
  };
  input: RouterInputs["tweet"]["timeline"];
  action: "like" | "unlike";
}

function updateCache({
  action,
  client,
  data,
  input,
  variables,
}: UpdateCacheProps) {
  client.setQueryData(
    [
      ["tweet", "timeline"],
      {
        input,
        type: "infinite",
      },
    ],
    (oldData) => {
      const newData = oldData as InfiniteData<
        RouterOutputs["tweet"]["timeline"]
      >;
      const likeValue = action === "like" ? 1 : -1;

      const newTweets = newData.pages.map((page) => {
        return {
          tweets: page.tweets.map((tweet) => {
            if (tweet.id === variables.tweetId) {
              return {
                ...tweet,
                likes: action === "like" ? [data.userId] : [],
                _count: {
                  likes: tweet._count.likes + likeValue,
                },
              };
            }

            return tweet;
          }),
        };
      });

      return {
        ...newData,
        pages: newTweets,
      };
    }
  );
}

export default updateCache;
