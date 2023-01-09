/* eslint-disable @typescript-eslint/no-misused-promises */
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Layout from "./Layout";

function BottomNavbar() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="font-semibold text-neutral-900">Loading...</div>;
  }
  return (
    <div className="fixed bottom-0 w-full bg-neutral-100 p-4">
      {session ? (
        <Layout classNames="flex items-center justify-between">
          <div className="flex flex-col items-center">
            {session?.user?.image ? (
              <Image
                src={session.user?.image}
                alt={`${session.user?.name || "default"} profile name`}
                width={60}
                height={60}
                className="rounded-full"
              />
            ) : null}
            <h2 className="font-semibold text-neutral-900">
              {session.user?.name}
            </h2>
          </div>
          <button
            className="border border-neutral-100 bg-neutral-900 px-4 py-2 transition-colors duration-300 ease-in-out hover:border-neutral-900 hover:bg-neutral-100 hover:text-neutral-900"
            onClick={() => signOut()}
          >
            Logout
          </button>
        </Layout>
      ) : (
        <Layout classNames="flex items-center justify-between">
          <h1 className="font-semibold text-neutral-900">
            Don&apos;t have an account? SignIn
          </h1>
          <button
            className="border border-neutral-100 bg-neutral-900 px-4 py-2 transition-colors duration-300 ease-in-out hover:border-neutral-900 hover:bg-neutral-100 hover:text-neutral-900"
            onClick={() => signIn("discord")}
          >
            Sign In with Discord
          </button>
        </Layout>
      )}
    </div>
  );
}

export default BottomNavbar;
