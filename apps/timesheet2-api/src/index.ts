import http from "http";

import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { GraphQLSchema } from "graphql";

import { Context, context } from "./context";
import { schema } from "./schema";

async function startApolloServer(context: Context) {
    const app = express();
    const httpServer = http.createServer(app);
    const server = new ApolloServer({
        context,
        schema: schema,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });
    await server.start();
    server.applyMiddleware({ app });
    await new Promise<void>((resolve) =>
        httpServer.listen({ port: 4000 }, resolve)
    );
    console.log(
        `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
    );
}

startApolloServer(context);
