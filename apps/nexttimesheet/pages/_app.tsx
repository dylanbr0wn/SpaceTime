import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import { client } from "../lib/apollo";
import { UserProvider } from "@auth0/nextjs-auth0";
import DashBoard from "../components/Dashboard";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ApolloProvider client={client}>
            <UserProvider>
                <DashBoard>
                    <Component {...pageProps} />
                </DashBoard>
            </UserProvider>
        </ApolloProvider>
    );
}

export default MyApp;
