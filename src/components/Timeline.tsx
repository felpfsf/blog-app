import { useEffect } from "react";
import useScrollPosition from "../hooks/useScrollPosition";
import { api } from "../utils/api";
import CreateTweet from "./CreateTweet";
import Tweet from "./Tweet";

const LIMIT = 10;

function Timeline() {
  const { data, hasNextPage, fetchNextPage, isFetching } =
    api.tweet.timeline.useInfiniteQuery(
      {
        limit: LIMIT,
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
    <div>
      <h1>Tweet Something</h1>
      <CreateTweet />
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} tweet={tweet} />
      ))}
    </div>
  );
}

export default Timeline;
