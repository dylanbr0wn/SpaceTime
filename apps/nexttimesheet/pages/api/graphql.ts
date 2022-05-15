// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ApolloServer } from "apollo-server-micro";
import Cors from "micro-cors";
import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import { schema } from "../../graphql";
import { createPrismaContext } from "../../graphql/context";

const cors = Cors({ origin: "http://localhost:3000", allowCredentials: true });

const server = new ApolloServer({
    context: createPrismaContext,
    schema: schema,
});

const startServer = server.start();

const handler: NextApiHandler = cors(async (req, res) => {
    const session = await getSession({ req });
    if (!session) {
        res.statusCode = 401;
        res.statusMessage = "Unauthorized";
        res.end();
        return false;
    }
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
