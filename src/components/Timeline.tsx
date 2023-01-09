import { api } from "../utils/api";
import CreateTweet from "./CreateTweet";
import Tweet from "./Tweet";

function Timeline() {
  const { data } = api.tweet.timeline.useQuery({
    limit: 1,
  });
  return (
    <div>
      <h1>Tweet Something</h1>
      <CreateTweet />
      {data?.tweets.map((tweet) => (
        <Tweet key={tweet.id} tweet={tweet} />
      ))}
      {JSON.stringify(data)}
    </div>
  );
}

export default Timeline;
