import { extendType, intArg, nonNull, objectType, stringArg } from "nexus";
import * as NexusPrisma from "nexus-prisma";

import { Context } from "../context";

export const EntryComment = objectType({
    name: NexusPrisma.EntryComment.$name,
    description: NexusPrisma.EntryComment.$description,
    definition(t) {
        t.field(NexusPrisma.EntryComment.id);
        t.field(NexusPrisma.EntryComment.createdAt);
        t.field(NexusPrisma.EntryComment.updatedAt);
        t.field(NexusPrisma.EntryComment.text);
        t.field(NexusPrisma.EntryComment.user);
    },
});

export const QueryEntryComment = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("getEntryComments", {
            type: "EntryComment",
            args: {
                timeEntryId: nonNull(intArg()),
            },
            resolve: (_parent, args, context: Context) => {
                return context.prisma.entryComment.findMany({
                    where: {
                        timeEntryId: args.id,
                    },
                    orderBy: {
                        createdAt: "desc",
                    },

                    include: {
                        user: {
                            include: {
                                profile: true,
                            },
                        },
                    },
                });
            },
        });
        t.nonNull.list.nonNull.field("getEntryCommentsByTimesheet", {
            type: "EntryComment",
            args: {
                timesheetId: nonNull(intArg()),
            },
            resolve: (_parent, args, context: Context) => {
                return context.prisma.entryComment.findMany({
                    where: {
                        timeEntry: {
                            timeEntryRow: {
                                timesheet: {
                                    id: args.timesheetId,
                                },
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "desc",
                    },

                    include: {
                        user: {
                            include: {
                                profile: true,
                            },
                        },
                    },
                });
            },
        });
    },
});

export const MutateEntryComment = extendType({
    type: "Mutation",
    definition(t) {
        t.field("createEntryComment", {
            type: "EntryComment",
            args: {
                timeEntryId: nonNull(intArg()),
                text: nonNull(stringArg()),
                userId: nonNull(intArg()),
            },
            resolve: (_parent, args, context: Context) => {
                return context.prisma.entryComment.create({
                    data: {
                        text: args.text,
                        timeEntry: {
                            connect: {
                                id: args.timeEntryId,
                            },
                        },
                        user: {
                            connect: {
                                id: args.userId,
                            },
                        },
                    },
                });
            },
        });
    },
});
