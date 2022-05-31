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
                {Component.auth ? (
                    // <Auth>
                    <Component {...pageProps} />
                ) : (
                    // </Auth>
                    <Component {...pageProps} />
                )}

                <Toaster />
            </ApolloProvider>
        </SessionProvider>
    );
}

// const Auth = ({ children }: { children: React.ReactNode }) => {
//     // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
//     const { status, data } = useSession({ required: true });

//     if (status === "loading") {
//         return <div>Loading...</div>;
//     }

//     return (
//         React.Children.map(children, (child) => {
//             // Checking isValidElement is the safe way and avoids a typescript
//             // error too.
//             if (React.isValidElement(child)) {
//                 return React.cloneElement(child, { user: data.user });
//             }
//             return child;
//         }) ?? null
//     );
// };
export default MyApp;
