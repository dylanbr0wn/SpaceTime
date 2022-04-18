import {
    arg,
    extendType,
    inputObjectType,
    intArg,
    nonNull,
    objectType,
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
                id: nonNull(intArg()),
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
                id: nonNull(intArg()),
            },
            resolve: (_parent, { id }, ctx) => {
                return ctx.prisma.timeEntry.delete({ where: { id } });
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
