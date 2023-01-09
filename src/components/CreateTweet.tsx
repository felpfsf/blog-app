import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Tweet } from "../lib/tweet.schemas";
import { tweetSchema } from "../lib/tweet.schemas";
import { api } from "../utils/api";

function CreateTweet() {
  const utils = api.useContext();

  const { mutateAsync } = api.tweet.create.useMutation();

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<Tweet>({ resolver: zodResolver(tweetSchema) });

  const onSubmit = async (data: Tweet) => {
    const tweetParsed = await tweetSchema.safeParseAsync(data);

    if (!tweetParsed.success) {
      return console.log("Something went wrong");
    }

    void mutateAsync(data);
    reset();
  };
  return (
    <>
      <form
        className="mb-4 flex w-full flex-col border-b p-4"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit(onSubmit)}
      >
        <textarea
          {...register("text")}
          className="w-full resize-none border-b border-b-neutral-400 bg-transparent outline-none"
          placeholder="What's going on?"
        ></textarea>
        {errors.text && <div>{errors.text.message}</div>}
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="border border-neutral-100 bg-neutral-900 px-4 py-2 font-semibold transition-colors duration-300 ease-in-out hover:border-neutral-900 hover:bg-neutral-100 hover:text-neutral-900"
          >
            Tweet
          </button>
        </div>
      </form>
    </>
  );
}

export default CreateTweet;
