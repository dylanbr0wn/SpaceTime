import { extendType, intArg, nonNull, objectType, stringArg } from "nexus";
import * as NexusPrisma from "nexus-prisma";

import { Context } from "../context";

export const TimeEntry = objectType({
    name: NexusPrisma.TimeEntry.$name,
    description: NexusPrisma.TimeEntry.$description,
    definition(t) {
        t.field(NexusPrisma.TimeEntry.id);
        t.field(NexusPrisma.TimeEntry.createdAt);
        t.field(NexusPrisma.TimeEntry.updatedAt);
        t.field(NexusPrisma.TimeEntry.index);
        t.field(NexusPrisma.TimeEntry.date);
        t.field(NexusPrisma.TimeEntry.hours);
        t.field(NexusPrisma.TimeEntry.entryComments);
    },
});

export const QueryTimeEntry = extendType({
    type: "Query",
    definition(t) {
        t.field("timeEntry", {
            type: "TimeEntry",
            args: {
                date: nonNull(stringArg()),
                timeEntryRowId: nonNull(stringArg()),
            },
            resolve: async (_, { date, timeEntryRowId }, ctx: Context) => {
                return ctx.prisma.timeEntry.findUnique({
                    where: {
                        date_timeEntryRowId: {
                            date: date,
                            timeEntryRowId: timeEntryRowId,
                        },
                    },
                });
            },
        });
        t.field("timeEntryFromIndex", {
            type: "TimeEntry",
            args: {
                timeEntryRowId: nonNull(stringArg()),
                index: nonNull(intArg()),
            },
            resolve: async (_, { index, timeEntryRowId }, ctx: Context) => {
                return ctx.prisma.timeEntry.findUnique({
                    where: {
                        index_timeEntryRowId: {
                            index,
                            timeEntryRowId,
                        },
                    },
                });
            },
        });
        t.field("timeEntryFromId", {
            type: "TimeEntry",
            args: {
                id: nonNull(stringArg()),
            },
            resolve: async (_, { id }, ctx: Context) => {
                return ctx.prisma.timeEntry.findUnique({
                    where: {
                        id,
                    },
                });
            },
        });
    },
});

// export const TimeEntryFromRowDateInput = inputObjectType({
//     name: "TimeEntryFromRowDateInput",
//     definition(t) {
//         t.field(NexusPrisma.TimeEntry.date);
//         t.field(NexusPrisma.TimeEntry.timeEntryRowId);
//     },
// });

// export const TimeEntryFromIdInput = inputObjectType({
//     name: "TimeEntryFromIdInput",
//     definition(t) {
//         t.field(NexusPrisma.TimeEntry.id);
//     },
// });

export const mutateTimeEntry = extendType({
    type: "Mutation",
    definition(t) {
        t.field("createTimeEntry", {
            type: "TimeEntry",
            args: {
                index: nonNull(intArg()),
                date: nonNull(stringArg()),
                hours: nonNull(intArg()),
                timeEntryRowId: nonNull(stringArg()),
            },
            resolve: (_parent, { index, date, hours, timeEntryRowId }, ctx) => {
                return ctx.prisma.timeEntry.create({
                    data: {
                        index,
                        timeEntryRowId,
                        date,
                        hours,
                    },
                });
            },
        });
        t.field("updateTimeEntryhours", {
            type: "TimeEntry",
            args: {
                id: nonNull(stringArg()),
                hours: nonNull(intArg()),
            },
            resolve: (_parent, { hours, id }, ctx: Context) => {
                return ctx.prisma.timeEntry.update({
                    where: { id },
                    data: {
                        hours,
                    },
                });
            },
        });
        t.field("deleteTimeEntry", {
            type: "TimeEntry",
            args: {
                id: nonNull(stringArg()),
            },
            resolve: async (_parent, { id }, ctx) => {
                await ctx.prisma.entryComment.deleteMany({
                    where: { timeEntryId: id },
                });
                return await ctx.prisma.timeEntry.delete({
                    where: { id },
                    include: {
                        entryComments: true,
                    },
                });
            },
        });
    },
});

// export const TimeEntryCreateInput = inputObjectType({
//     name: "TimeEntryCreateInput",
//     definition(t) {
//         t.field(NexusPrisma.TimeEntry.date);
//         t.field(NexusPrisma.TimeEntry.hours);
//         t.field(NexusPrisma.TimeEntry.timeEntryRowId);
//         t.field(NexusPrisma.TimeEntry.index);
//     },
// });

// export const TimeEntryUpdateInput = inputObjectType({
//     name: "TimeEntryUpdateInput",
//     definition(t) {
//         t.field(NexusPrisma.TimeEntry.hours);
//     },
// });
