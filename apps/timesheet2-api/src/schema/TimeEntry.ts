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

export const TimeEntry = objectType({
    name: NexusPrisma.TimeEntry.$name,
    description: NexusPrisma.TimeEntry.$description,
    definition(t) {
        t.field(NexusPrisma.TimeEntry.id);
        t.field(NexusPrisma.TimeEntry.createdAt);
        t.field(NexusPrisma.TimeEntry.updatedAt);
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
                TimeEntry: nonNull(arg({ type: TimeEntryFromRowDateInput })),
            },
            resolve: async (_, { TimeEntry }, ctx: Context) => {
                return ctx.prisma.timeEntry.findUnique({
                    where: {
                        date_timeEntryRowId: {
                            date: TimeEntry.date,
                            timeEntryRowId: TimeEntry.timeEntryRowId,
                        },
                    },
                });
            },
        });
        t.field("timeEntryFromId", {
            type: "TimeEntry",
            args: {
                TimeEntry: nonNull(arg({ type: TimeEntryFromIdInput })),
            },
            resolve: async (_, { TimeEntry }, ctx: Context) => {
                return ctx.prisma.timeEntry.findUnique({
                    where: {
                        id: TimeEntry.id,
                    },
                });
            },
        });
    },
});

export const TimeEntryFromRowDateInput = inputObjectType({
    name: "TimeEntryFromRowDateInput",
    definition(t) {
        t.field(NexusPrisma.TimeEntry.date);
        t.field(NexusPrisma.TimeEntry.timeEntryRowId);
    },
});

export const TimeEntryFromIdInput = inputObjectType({
    name: "TimeEntryFromIdInput",
    definition(t) {
        t.field(NexusPrisma.TimeEntry.id);
    },
});

export const mutateTimeEntry = extendType({
    type: "Mutation",
    definition(t) {
        t.field("createTimeEntry", {
            type: "TimeEntry",
            args: {
                data: nonNull(
                    arg({
                        type: TimeEntryCreateInput,
                    })
                ),
            },
            resolve: (_parent, { data }, ctx) => {
                return ctx.prisma.timeEntry.create({ data });
            },
        });
        t.field("updateTimeEntryhours", {
            type: "TimeEntry",
            args: {
                id: nonNull(stringArg()),
                data: nonNull(
                    arg({
                        type: TimeEntryUpdateInput,
                    })
                ),
            },
            resolve: (_parent, { data, id }, ctx: Context) => {
                return ctx.prisma.timeEntry.update({
                    where: { id },
                    data,
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
                return await ctx.prisma.timeEntry.delete({ where: { id } });
            },
        });
    },
});

export const TimeEntryCreateInput = inputObjectType({
    name: "TimeEntryCreateInput",
    definition(t) {
        t.field(NexusPrisma.TimeEntry.date);
        t.field(NexusPrisma.TimeEntry.hours);
        t.field(NexusPrisma.TimeEntry.timeEntryRowId);
    },
});

export const TimeEntryUpdateInput = inputObjectType({
    name: "TimeEntryUpdateInput",
    definition(t) {
        t.field(NexusPrisma.TimeEntry.hours);
    },
});
