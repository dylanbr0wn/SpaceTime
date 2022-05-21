import SchemaBuilder from "@pothos/core";
// import ErrorsPlugin from "@pothos/plugin-errors";
import PrismaPlugin from "@pothos/plugin-prisma";

import prisma from "../prisma/index";

// This is the default location for the generator, but this can be
// customized as described above.
// Using a type only import will help avoid issues with undeclared
// exports in esm mode
import type PrismaTypes from "./pothos-types";

export const builder = new SchemaBuilder<{
    PrismaTypes: PrismaTypes;
    Scalars: {
        Date: {
            Input: Date;
            Output: Date;
        };
    };
}>({
    plugins: [
        // ErrorsPlugin,
        PrismaPlugin,
    ],
    prisma: {
        client: prisma,
    },
    // errorOptions: {
    //     defaultTypes: [Error],
    // },
});
