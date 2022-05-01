// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { ApolloServer } from "apollo-server-micro";
import { createPrismaContext } from "../../graphql/context";
import { schema } from "../../graphql";

import Cors from "micro-cors";

const cors = Cors();

const server = new ApolloServer({
    context: createPrismaContext,
    schema: schema,
});

const startServer = server.start();

const handler = cors(async (req, res) => {
    if (req.method === "OPTIONS") {
        res.end();
        return false;
    }
    await startServer;

    await server.createHandler({
        path: "/api/graphql",
    })(req, res);
});

export const config = {
    api: {
        bodyParser: false,
    },
};

export default handler;
