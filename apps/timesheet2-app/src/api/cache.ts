import { InMemoryCache, makeVar } from "@apollo/client";

export const msalAccountVar = makeVar([]);

export const cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                msalAccount: {
                    read() {
                        return msalAccountVar();
                    },
                },
            },
        },
    },
});
