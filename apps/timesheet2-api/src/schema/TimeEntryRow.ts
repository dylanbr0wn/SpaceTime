import {
    arg,
    extendType,
    inputObjectType,
    intArg,
    nonNull,
    nullable,
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

export const QueryTimeEntryRow = extendType({
    type: "Query",
    definition(t) {
        t.field("getTimeEntryRow", {
            type: "TimeEntryRow",
            args: {
                id: nonNull(intArg()),
            },
            resolve: (_parent, { id }, context: Context) => {
                return context.prisma.timeEntryRow.findUnique({
                    where: {
                        id,
                    },
                    include: {
                        timeEntries: true,
                    },
                });
            },
        });
        t.nonNull.list.nonNull.field("getTimeEntryRows", {
            type: "TimeEntryRow",
            args: {
                timesheetId: nonNull(intArg()),
            },
            resolve: (_parent, { timesheetId }, context: Context) => {
                return context.prisma.timeEntryRow.findMany({
                    where: {
                        timesheetId,
                    },
                    include: {
                        timeEntries: true,
                    },
                });
            },
        });
    },
});

export const MutateTimeEntryRow = extendType({
    type: "Mutation",
    definition(t) {
        t.field("createTimeEntryRow", {
            type: "TimeEntryRow",
            args: {
                timesheetId: nonNull(intArg()),
                departmentId: intArg(),
                projectId: intArg(),
                workTypeId: intArg(),
            },
            resolve: (_parent, args, ctx: Context) => {
                return ctx.prisma.timeEntryRow.create({
                    data: {
                        timesheetId: args.timesheetId,
                        departmentId: args.departmentId ?? undefined,
                        projectId: args.projectId ?? undefined,
                        workTypeId: args.workTypeId ?? undefined,
                    },
                });
            },
        });
        t.field("updateTimeEntryRow", {
            type: "TimeEntryRow",
            args: {
                id: nonNull(intArg()),
                departmentId: intArg(),
                projectId: intArg(),
                workTypeId: intArg(),
            },
            resolve: (_parent, args, ctx: Context) => {
                return ctx.prisma.timeEntryRow.update({
                    where: { id: args.id },
                    data: {
                        workTypeId:
                            args.workTypeId === -1
                                ? null
                                : args.workTypeId ?? undefined,
                        projectId:
                            args.projectId === -1
                                ? null
                                : args.projectId ?? undefined,
                        departmentId:
                            args.departmentId === -1
                                ? null
                                : args.departmentId ?? undefined,
                    },
                });
            },
        });
        t.field("deleteTimeEntryRow", {
            type: "TimeEntryRow",
            args: {
                TimeEntryRow: nonNull(
                    arg({
                        type: TimeEntryRowDeleteInput,
                    })
                ),
            },
            resolve: (_parent, { TimeEntryRow }, ctx: Context) => {
                return ctx.prisma.timeEntryRow.delete({
                    where: { id: TimeEntryRow.id },
                });
            },
        });
    },
});

// export const TimeEntryRowCreateInput = inputObjectType({
//     name: "TimeEntryRowCreateInput",
//     definition(t) {
//         t.field(NexusPrisma.TimeEntryRow.departmentId);
//         t.field(NexusPrisma.TimeEntryRow.timesheetId);
//         t.field(NexusPrisma.TimeEntryRow.workTypeId);
//         t.field(NexusPrisma.TimeEntryRow.projectId);
//     },
// });

export const TimeEntryRowUpdateInput = inputObjectType({
    name: "TimeEntryRowUpdateInput",
    definition(t) {
        t.field(NexusPrisma.TimeEntryRow.id);
        t.field(NexusPrisma.TimeEntryRow.departmentId);
        t.field(NexusPrisma.TimeEntryRow.workTypeId);
        t.field(NexusPrisma.TimeEntryRow.projectId);
    },
});

export const TimeEntryRowDeleteInput = inputObjectType({
    name: "TimeEntryRowDeleteInput",
    definition(t) {
        t.field(NexusPrisma.TimeEntryRow.id);
    },
});
