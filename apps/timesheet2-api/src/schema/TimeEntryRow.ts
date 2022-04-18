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

export const TimeEntryRow = objectType({
    name: NexusPrisma.TimeEntryRow.$name,
    description: NexusPrisma.TimeEntryRow.$description,
    definition(t) {
        t.field(NexusPrisma.TimeEntryRow.id);
        t.field(NexusPrisma.TimeEntryRow.createdAt);
        t.field(NexusPrisma.TimeEntryRow.updatedAt);
        t.field(NexusPrisma.TimeEntryRow.workType);
        t.field(NexusPrisma.TimeEntryRow.project);
        t.field(NexusPrisma.TimeEntryRow.department);
        t.field(NexusPrisma.TimeEntryRow.timeEntries);
    },
});

export const MutateTimeEntryRow = extendType({
    type: "Mutation",
    definition(t) {
        t.field("createTimeEntryRow", {
            type: "TimeEntryRow",
            args: {
                data: nonNull(
                    arg({
                        type: TimeEntryRowCreateInput,
                    })
                ),
            },
            resolve: (_parent, { data }, ctx: Context) => {
                return ctx.prisma.timeEntryRow.create({ data });
            },
        });
        t.field("updateTimeEntryRow", {
            type: "TimeEntryRow",
            args: {
                data: nonNull(
                    arg({
                        type: TimeEntryRowUpdateInput,
                    })
                ),
                id: nonNull(intArg()),
            },
            resolve: (_parent, { data, id }, ctx: Context) => {
                return ctx.prisma.timeEntryRow.update({
                    where: { id },
                    data,
                });
            },
        });
        t.field("deleteTimeEntryRow", {
            type: "TimeEntryRow",
            args: {
                id: nonNull(intArg()),
            },
            resolve: (_parent, { id }, ctx: Context) => {
                return ctx.prisma.timeEntryRow.delete({ where: { id } });
            },
        });
    },
});

export const TimeEntryRowCreateInput = inputObjectType({
    name: "TimeEntryRowCreateInput",
    definition(t) {
        t.field(NexusPrisma.TimeEntryRow.departmentId);
        t.field(NexusPrisma.TimeEntryRow.timesheetId);
        t.field(NexusPrisma.TimeEntryRow.workTypeId);
        t.field(NexusPrisma.TimeEntryRow.projectId);
    },
});

export const TimeEntryRowUpdateInput = inputObjectType({
    name: "TimeEntryRowUpdateInput",
    definition(t) {
        t.field(NexusPrisma.TimeEntryRow.departmentId);
        t.field(NexusPrisma.TimeEntryRow.workTypeId);
        t.field(NexusPrisma.TimeEntryRow.projectId);
    },
});
