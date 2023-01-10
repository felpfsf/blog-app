import type { QueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import { useSession } from "next-auth/react";
import Image from "next/image";
import type { RouterInputs, RouterOutputs } from "../utils/api";
import { api } from "../utils/api";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import Link from "next/link";
import updateCache from "../lib/updateCache";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

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
  client: QueryClient;
  input: RouterInputs["tweet"]["timeline"];
  tweet: RouterOutputs["tweet"]["timeline"]["tweets"][number];
}

function Tweet({ client, input, tweet }: TweetProps) {
  const { data: session } = useSession();
  const tweetDate = dayjs(tweet.createdAt).fromNow();

  const likeMutation = api.tweet.like.useMutation({
    onSuccess: (data, variables) => {
      updateCache({ action: "like", client, data, input, variables });
    },
  }).mutateAsync;

  const unlikeMutation = api.tweet.unlike.useMutation({
    onSuccess: (data, variables) => {
      updateCache({ client, data, input, variables, action: "unlike" });
    },
  }).mutateAsync;

  const hasLike = tweet.likes.length > 0;

  const swal = withReactContent(Swal);

  const loginRequiredAlert = (text: string) => {
    void swal.fire({
      title: text,
      timer: 1500,
      backdrop: `
      rgba(0,0,123,0.4)
      url("/images/nyan-cat.gif")
      left top
      no-repeat
  `,
    });
  };

  const handleLike = () => {
    if (!session) {
      return loginRequiredAlert("Login is required");
    }

    if (hasLike) {
      void unlikeMutation({
        tweetId: tweet.id,
      });
      return;
    }

    void likeMutation({
      tweetId: tweet.id,
    });
  };

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
            <Link
              href={`/${tweet.author.name || "default"}`}
              className="border-b border-b-transparent hover:border-b hover:border-b-purple-500 hover:text-purple-500"
            >
              {tweet.author.name}
            </Link>
            <span className="font-light text-neutral-500">{tweetDate}</span>
          </h2>
        </div>
        <p>{tweet.text}</p>
        <div
          className={`
          mt-2 flex cursor-pointer items-center gap-x-2 text-gray-500 hover:text-red-500
          ${hasLike ? "text-red-500" : "text-gray-500"}
          `}
          onClick={handleLike}
        >
          {hasLike ? <AiFillHeart /> : <AiOutlineHeart />}
          <span className="text-xs">{tweet._count.likes}</span>
        </div>
      </div>
    </div>
  );
}

export default Tweet;
