import prisma from "../../prisma";
import { builder } from "../builder";

builder.prismaObject("OneTimeToken", {
    findUnique: (token) => ({ id: token.id }),
    fields: (t) => ({
        id: t.exposeID("id"),
        createdAt: t.field({
            type: "Date",
            resolve: (token) => token.createdAt,
        }),
        updatedAt: t.field({
            type: "Date",
            resolve: (token) => token.updatedAt,
        }),
        user: t.relation("user"),
        tenant: t.relation("tenant"),
    }),
});

builder.queryFields((t) => ({
    oneTimeTokens: t.prismaField({
        type: ["OneTimeToken"],
        args: {
            tenantId: t.arg.string({ required: true }),
        },
        resolve: async (query, root, args, ctx, info) => {
            return await prisma.oneTimeToken.findMany({
                ...query,
                where: {
                    tenant: {
                        id: args.tenantId,
                    },
                },
            });
        },
    }),
    oneTimeToken: t.prismaField({
        type: "OneTimeToken",
        args: {
            id: t.arg.string({ required: true }),
        },
        resolve: async (query, root, args, ctx, info) => {
            return await prisma.oneTimeToken.findUnique({
                ...query,
                rejectOnNotFound: true,
                where: {
                    id: args.id,
                },
            });
        },
    }),
}));

builder.mutationFields((t) => ({
    createOneTimeToken: t.prismaField({
        type: "OneTimeToken",
        args: {
            userId: t.arg.string({ required: true }),
            tenantId: t.arg.string({ required: true }),
        },
        resolve: async (query, root, args, ctx, info) => {
            return await prisma.oneTimeToken.create({
                data: {
                    user: {
                        connect: {
                            id: args.userId,
                        },
                    },
                    tenant: {
                        connect: {
                            id: args.tenantId,
                        },
                    },
                },
            });
        },
    }),
}));
