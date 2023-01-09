import { api } from "../utils/api";
import CreateTweet from "./CreateTweet";

function Timeline() {
  const { data } = api.tweet.timeline.useQuery({
    limit: 1,
  });
  return (
    <div>
      <h1>Tweet Something</h1>
      <CreateTweet />
      {JSON.stringify(data)}
    </div>
  );
}

export default Timeline;
