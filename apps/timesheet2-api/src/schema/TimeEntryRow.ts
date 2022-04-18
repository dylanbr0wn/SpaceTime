import { arg, extendType, inputObjectType, nonNull, objectType } from "nexus";
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
                TimeEntryRow: nonNull(
                    arg({
                        type: TimeEntryRowCreateInput,
                    })
                ),
            },
            resolve: (_parent, { TimeEntryRow }, ctx: Context) => {
                return ctx.prisma.timeEntryRow.create({
                    data: {
                        workType: {
                            connect: {
                                id: TimeEntryRow.workTypeId,
                            },
                        },
                        project: {
                            connect: {
                                id: TimeEntryRow.projectId,
                            },
                        },
                        department: {
                            connect: {
                                id: TimeEntryRow.departmentId,
                            },
                        },
                        timesheet: {
                            connect: {
                                id: TimeEntryRow.timesheetId,
                            },
                        },
                    },
                });
            },
        });
        t.field("updateTimeEntryRow", {
            type: "TimeEntryRow",
            args: {
                TimeEntryRow: nonNull(
                    arg({
                        type: TimeEntryRowUpdateInput,
                    })
                ),
            },
            resolve: (_parent, { TimeEntryRow }, ctx: Context) => {
                return ctx.prisma.timeEntryRow.update({
                    where: { id: TimeEntryRow.id },
                    data: {
                        workType: {
                            connect: {
                                id: TimeEntryRow.workTypeId,
                            },
                        },
                        project: {
                            connect: {
                                id: TimeEntryRow.projectId,
                            },
                        },
                        department: {
                            connect: {
                                id: TimeEntryRow.departmentId,
                            },
                        },
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
