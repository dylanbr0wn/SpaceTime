import prisma from "../../prisma";
import { builder } from "../builder";

builder.prismaObject("TimeEntryRow", {
    findUnique: (timeEntryRow) => ({ id: timeEntryRow.id }),
    fields: (t) => ({
        id: t.exposeID("id"),
        createdAt: t.field({
            type: "Date",
            resolve: (timeEntryRow) => timeEntryRow.createdAt,
        }),
        updatedAt: t.field({
            type: "Date",
            resolve: (timeEntryRow) => timeEntryRow.updatedAt,
        }),
        timeEntries: t.relation("timeEntries"),
        department: t.relation("department", { nullable: true }),
        project: t.relation("project", { nullable: true }),
        workType: t.relation("workType", { nullable: true }),
    }),
});

builder.queryFields((t) => ({
    timeEntryRows: t.prismaField({
        type: ["TimeEntryRow"],
        args: {
            timesheetId: t.arg.string({ required: true }),
        },
        resolve: async (query, root, args, ctx, info) => {
            return await prisma.timeEntryRow.findMany({
                ...query,
                where: {
                    timesheet: {
                        id: args.timesheetId,
                    },
                },
            });
        },
    }),
    timeEntryRow: t.prismaField({
        type: "TimeEntryRow",
        args: {
            id: t.arg.string({ required: true }),
        },
        resolve: async (query, root, args, ctx, info) => {
            return await prisma.timeEntryRow.findUnique({
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
    createTimeEntryRow: t.prismaField({
        type: "TimeEntryRow",
        args: {
            departmentId: t.arg.string(),
            projectId: t.arg.string(),
            workTypeId: t.arg.string(),
            timesheetId: t.arg.string({ required: true }),
        },
        resolve: async (query, root, args, ctx, info) => {
            return await prisma.timeEntryRow.create({
                data: {
                    departmentId: args.departmentId ?? undefined,

                    projectId: args.projectId ?? undefined,

                    workTypeId: args.workTypeId ?? undefined,

                    timesheetId: args.timesheetId,
                },
            });
        },
    }),
    updateTimeEntryRow: t.prismaField({
        type: "TimeEntryRow",
        args: {
            id: t.arg.string({ required: true }),
            departmentId: t.arg.string(),
            projectId: t.arg.string(),
            workTypeId: t.arg.string(),
        },
        resolve: async (query, root, args, ctx, info) => {
            return await prisma.timeEntryRow.update({
                where: {
                    id: args.id,
                },
                data: {
                    departmentId: args.departmentId ?? undefined,
                    projectId: args.projectId ?? undefined,
                    workTypeId: args.workTypeId ?? undefined,
                },
            });
        },
    }),
    deleteTimeEntryRow: t.prismaField({
        type: "TimeEntryRow",
        args: {
            id: t.arg.string({ required: true }),
        },
        resolve: async (query, root, args, ctx, info) => {
            const entries = await prisma.timeEntry.findMany({
                where: { timeEntryRowId: args.id },
                select: {
                    entryComments: true,
                },
            });

            await Promise.all(
                entries.map(async (entry) => {
                    return await Promise.all(
                        entry.entryComments.map(async (entryComment) => {
                            await prisma.entryComment.delete({
                                where: {
                                    id: entryComment.id,
                                },
                            });
                        })
                    );
                })
            );

            await prisma.timeEntry.deleteMany({
                where: { timeEntryRowId: args.id },
            });
            return await prisma.timeEntryRow.delete({
                where: {
                    id: args.id,
                },
            });
        },
    }),
}));
