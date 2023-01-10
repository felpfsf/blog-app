import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import useScrollPosition from "../hooks/useScrollPosition";
import type { RouterInputs } from "../utils/api";
import { api } from "../utils/api";
import CreateTweet from "./CreateTweet";
import Tweet from "./Tweet";

const LIMIT = 10;

interface TimelineProps {
  where: RouterInputs["tweet"]["timeline"]["where"];
}

function Timeline({ where }: TimelineProps) {
  const client = useQueryClient();
  const { data, hasNextPage, fetchNextPage, isFetching } =
    api.tweet.timeline.useInfiniteQuery(
      {
        limit: LIMIT,
        where,
      },
      { getNextPageParam: (lastPage) => lastPage.nextCursor }
    );
  const tweets = data?.pages.flatMap((page) => page.tweets) ?? [];

  const scrollPosition = useScrollPosition();

  useEffect(() => {
    if (scrollPosition > 90 && hasNextPage && !isFetching) {
      void fetchNextPage();
    }
  }, [scrollPosition, hasNextPage, isFetching, fetchNextPage]);
  return (
    <div className="mt-4">
      <h1 className="text-2xl font-bold">Tweet Something</h1>
      <CreateTweet />
      {tweets.map((tweet) => (
        <Tweet
          key={tweet.id}
          tweet={tweet}
          input={{ where, limit: LIMIT }}
          client={client}
        />
      ))}
    </div>
  );
}

export default Timeline;
