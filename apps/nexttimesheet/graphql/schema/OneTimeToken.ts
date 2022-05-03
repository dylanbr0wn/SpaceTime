import { extendType, nonNull, objectType, stringArg } from "nexus";
import * as NexusPrisma from "nexus-prisma";
import { Context } from "../context";

export const OneTimeToken = objectType({
    name: NexusPrisma.OneTimeToken.$name,
    description: NexusPrisma.OneTimeToken.$description,
    definition(t) {
        t.field(NexusPrisma.OneTimeToken.id);
        t.field(NexusPrisma.OneTimeToken.user);
        t.field(NexusPrisma.OneTimeToken.tenant);
        t.field(NexusPrisma.OneTimeToken.createdAt);
        t.field(NexusPrisma.OneTimeToken.updatedAt);
    },
});

export const QueryOneTimeToken = extendType({
    type: "Query",
    definition(t) {
        t.field("getOneTimeToken", {
            type: OneTimeToken,
            args: {
                id: nonNull(stringArg()),
            },
            resolve: (_parent, { id }, context: Context) => {
                return context.prisma.oneTimeToken.findUnique({
                    where: {
                        id,
                    },
                    include: {
                        user: true,
                        tenant: true,
                    },
                });
            },
        });
    },
});

export const MutationOneTimeToken = extendType({
    type: "Mutation",
    definition(t) {
        t.field("createOneTimeToken", {
            type: OneTimeToken,
            args: {
                userId: nonNull(stringArg()),
                tenantId: nonNull(stringArg()),
            },
            resolve: (_parent, { userId, tenantId }, context: Context) => {
                return context.prisma.oneTimeToken.create({
                    data: {
                        user: {
                            connect: {
                                id: userId,
                            },
                        },
                        tenant: {
                            connect: {
                                id: tenantId,
                            },
                        },
                    },
                });
            },
        });
    },
});
