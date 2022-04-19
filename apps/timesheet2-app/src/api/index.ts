import { ApolloClient, InMemoryCache } from "@apollo/client";
export * from "./graphql";

export const client = new ApolloClient({
    uri: "http://localhost:4000/graphql",
    cache: new InMemoryCache(),
    connectToDevTools: true,
});
