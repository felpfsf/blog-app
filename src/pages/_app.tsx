import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "../utils/api";

import "../styles/globals.css";
import Layout from "../components/Layout";
import BottomNavbar from "../components/BottomNavbar";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Layout>
        <main>
          <Component {...pageProps} />
        </main>
      </Layout>
      <BottomNavbar />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
