import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import * as React from "react";
import { Toaster } from "react-hot-toast";

import "../styles/globals.css";
import { withTRPC } from "@trpc/next";
import { AppRouter } from "../server/router";
import superjson from "superjson"

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return "";
  }
  if (process.browser) return ""; // Browser should use current path
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
    

    return (
        <SessionProvider session={session}>
           
                <Component {...pageProps} />
                <Toaster />
        </SessionProvider>
    );
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = `${getBaseUrl()}/api/trpc`;

    return {
      url,
      transformer: superjson,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(MyApp);
