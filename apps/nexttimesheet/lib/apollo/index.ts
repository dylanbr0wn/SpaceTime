import { IncomingHttpHeaders } from "http";

import merge from "deepmerge";
import fetch from "isomorphic-unfetch";
import isEqual from "lodash/isEqual";
import { AppProps } from "next/app";
import { useMemo } from "react";

import {
    ApolloClient,
    from,
    InMemoryCache,
    makeVar,
    NormalizedCacheObject,
} from "@apollo/client";
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import { onError } from "@apollo/client/link/error";
export * from "./graphql";

export const IsChanged = makeVar(false);

export const APOLLO_STATE_PROP_NAME = "__APOLLO_STATE__";

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

function createApolloClient(headers: IncomingHttpHeaders | null = null) {
    const enhancedFetch = async (url: RequestInfo, init: RequestInit) => {
        const response = await fetch(url, {
            ...init,
            headers: {
                ...init.headers,
                "Access-Control-Allow-Origin": "*",
                // here we pass the cookie along for each request
                Cookie: headers?.cookie ?? "",
            },
        });
        return response;
    };

    return new ApolloClient({
        ssrMode: typeof window === "undefined",
        link: from([
            onError(({ graphQLErrors, networkError }) => {
                if (graphQLErrors)
                    graphQLErrors.forEach(({ message, locations, path }) =>
                        console.log(
                            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
                        )
                    );
                if (networkError)
                    console.log(
                        `[Network error]: ${networkError}. Backend is unreachable. Is it running?`
                    );
            }),
            new BatchHttpLink({
                uri: "http://localhost:3000/api/graphql",
                batchMax: 10,
                batchInterval: 20,
                fetchOptions: {
                    mode: "cors",
                },
                credentials: "include",
                fetch: enhancedFetch,
            }),
            // createUploadLink({
            //     uri: "http://localhost:3000/api/graphql",
            //     // Make sure that CORS and cookies work
            //     fetchOptions: {
            //         mode: "cors",
            //     },
            //     credentials: "include",
            //     fetch:
            // }),
        ]),
        cache: new InMemoryCache({
            typePolicies: {
                Query: {
                    fields: {
                        timeEntryFromIndex(entry, { canRead }) {
                            if (!entry) return entry;
                            return canRead(entry) ? entry : null;
                        },
                    },
                },
            },
        }),

        connectToDevTools: true,
    });
}

type InitialState = NormalizedCacheObject | undefined;

interface IInitializeApollo {
    headers?: IncomingHttpHeaders | null;
    initialState?: InitialState | null;
}

export function initializeApollo(
    { headers, initialState }: IInitializeApollo = {
        headers: null,
        initialState: null,
    }
) {
    const _apolloClient = apolloClient ?? createApolloClient(headers);

    // If your page has Next.js data fetching methods that use Apollo Client, the initial state
    // gets hydrated here
    if (initialState) {
        // Get existing cache, loaded during client side data fetching
        const existingCache = _apolloClient.extract();

        // Merge the initialState from getStaticProps/getServerSideProps in the existing cache
        const data = merge(existingCache, initialState, {
            // combine arrays using object equality (like in sets)
            arrayMerge: (destinationArray, sourceArray) => [
                ...sourceArray,
                ...destinationArray.filter((d) =>
                    sourceArray.every((s) => !isEqual(d, s))
                ),
            ],
        });

        // Restore the cache with the merged data
        _apolloClient.cache.restore(data);
    }
    // For SSG and SSR always create a new Apollo Client
    if (typeof window === "undefined") return _apolloClient;
    // Create the Apollo Client once in the client
    if (!apolloClient) apolloClient = _apolloClient;

    return _apolloClient;
}

export function addApolloState(
    client: ApolloClient<NormalizedCacheObject>,
    pageProps: AppProps["pageProps"]
) {
    if (pageProps?.props) {
        pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
    }

    return pageProps;
}

export function useApollo(pageProps: AppProps["pageProps"]) {
    const state = pageProps[APOLLO_STATE_PROP_NAME];
    const store = useMemo(() => initializeApollo(state), [state]);
    return store;
}
