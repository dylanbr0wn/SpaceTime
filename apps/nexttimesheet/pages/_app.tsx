import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";

import { ApolloProvider } from "@apollo/client";
import { UserProvider } from "@auth0/nextjs-auth0";

import { client } from "../lib/apollo";

import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ApolloProvider client={client}>
            <UserProvider>
                <Component {...pageProps} />

                <Toaster />
            </UserProvider>
        </ApolloProvider>
    );
}

export default MyApp;
