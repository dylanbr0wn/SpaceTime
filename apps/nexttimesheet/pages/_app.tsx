import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import * as React from "react";
import { Toaster } from "react-hot-toast";

import { ApolloProvider } from "@apollo/client";

import { useApollo } from "../lib/apollo";

import "../styles/globals.css";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
    const apolloClient = useApollo(pageProps);

    return (
        <SessionProvider session={session}>
            <ApolloProvider client={apolloClient}>
                <Component {...pageProps} />
                <Toaster />
            </ApolloProvider>
        </SessionProvider>
    );
}

export default MyApp;
