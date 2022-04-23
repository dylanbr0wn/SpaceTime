import { InMemoryCache, makeVar } from "@apollo/client";

type usedRow = {
    department: string;
    project: string;
    workType: string;
};

export const msalAccountVar = makeVar([]);

export const usedRowsVar = makeVar<usedRow[]>([]);

export const cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                msalAccount: {
                    read() {
                        return msalAccountVar();
                    },
                },
                usedRows: {
                    read() {
                        return usedRowsVar();
                    },
                },
            },
        },
    },
});
