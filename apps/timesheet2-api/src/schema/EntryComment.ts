import {
    arg,
    extendType,
    inputObjectType,
    nonNull,
    objectType,
    stringArg,
} from "nexus";
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
                timeEntryId: nonNull(stringArg()),
            },
            resolve: (_parent, args, context: Context) => {
                return context.prisma.entryComment.findMany({
                    where: {
                        timeEntryId: args.timeEntryId,
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
                timesheetId: nonNull(stringArg()),
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
                entryComment: nonNull(arg({ type: EntryCommentCreateInput })),
            },
            resolve: (_parent, { entryComment }, context: Context) => {
                return context.prisma.entryComment.create({
                    data: {
                        text: entryComment.text,
                        timeEntry: {
                            connect: {
                                id: entryComment.timeEntryId,
                            },
                        },
                        user: {
                            connect: {
                                id: entryComment.userId,
                            },
                        },
                    },
                });
            },
        });
        t.field("updateEntryComment", {
            type: "EntryComment",
            args: {
                entryComment: nonNull(arg({ type: EntryCommentUpdateInput })),
            },
            resolve: (_parent, { entryComment }, context: Context) => {
                return context.prisma.entryComment.update({
                    where: {
                        id: entryComment.id,
                    },
                    data: {
                        text: entryComment.text,
                    },
                });
            },
        });
        t.field("deleteEntryComment", {
            type: "EntryComment",
            args: {
                EntryComment: nonNull(arg({ type: EntryCommentDeleteInput })),
            },
            resolve: (_parent, { EntryComment }, context: Context) => {
                return context.prisma.entryComment.delete({
                    where: {
                        id: EntryComment.id,
                    },
                });
            },
        });
    },
});

export const EntryCommentCreateInput = inputObjectType({
    name: "EntryCommentCreateInput",
    definition(t) {
        t.nonNull.field(NexusPrisma.EntryComment.timeEntryId);
        t.nonNull.field(NexusPrisma.EntryComment.text);
        t.nonNull.field(NexusPrisma.EntryComment.userId);
    },
});

export const EntryCommentUpdateInput = inputObjectType({
    name: "EntryCommentUpdateInput",
    definition(t) {
        t.field(NexusPrisma.EntryComment.text);
        t.field(NexusPrisma.EntryComment.id);
    },
});

export const EntryCommentDeleteInput = inputObjectType({
    name: "EntryCommentDeleteInput",
    definition(t) {
        t.field(NexusPrisma.EntryComment.id);
    },
});
