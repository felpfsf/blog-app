import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import Image from "next/image";
import type { RouterInputs, RouterOutputs } from "../utils/api";

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "a few seconds",
    m: "a minute",
    mm: "%d minutes",
    h: "an hour",
    hh: "%dh",
    d: "a day",
    dd: "%d days",
    M: "a month",
    MM: "%d months",
    y: "a year",
    yy: "%d years",
  },
});

interface TweetProps {
  input?: RouterInputs["tweet"]["timeline"];
  tweet: RouterOutputs["tweet"]["timeline"]["tweets"][number];
}

function Tweet({ input, tweet }: TweetProps) {
  const tweetDate = dayjs(tweet.createdAt).fromNow();
  return (
    <div className="mb-4 flex gap-x-4 border-b border-b-neutral-400 p-4">
      <div>
        {tweet.author.image && (
          <Image
            src={tweet.author.image}
            alt={`${tweet.author.name || "default"} profile image`}
            width={60}
            height={60}
            className="rounded-full"
          />
        )}
      </div>
      <div className="flex w-full flex-col">
        <div>
          <h2 className="flex gap-2 font-semibold">
            {tweet.author.name}
            <span className="font-light text-neutral-500">{tweetDate}</span>
          </h2>
        </div>
        <p>{tweet.text}</p>
      </div>
    </div>
  );
}

export default Tweet;
