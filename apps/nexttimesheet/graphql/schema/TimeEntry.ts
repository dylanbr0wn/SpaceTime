import prisma from "../../prisma";
import { builder } from "../builder";

builder.prismaObject("TimeEntry", {
    findUnique: (timeEntry) => ({ id: timeEntry.id }),
    fields: (t) => ({
        id: t.exposeID("id"),
        createdAt: t.field({
            type: "Date",
            resolve: (timeEntry) => timeEntry.createdAt,
        }),
        updatedAt: t.field({
            type: "Date",
            resolve: (timeEntry) => timeEntry.updatedAt,
        }),
        index: t.exposeInt("index"),
        hours: t.exposeFloat("hours"),
        date: t.field({
            type: "Date",
            resolve: (timeEntry) => timeEntry.date,
        }),
        entryComments: t.relation("entryComments"),
    }),
});

builder.queryFields((t) => ({
    timeEntry: t.prismaField({
        type: "TimeEntry",
        args: {
            timeEntryRowId: t.arg.string({ required: true }),
            index: t.arg.int({ required: true }),
        },
        resolve: async (query, root, args, ctx, info) => {
            return await prisma.timeEntry.findUnique({
                ...query,
                where: {
                    index_timeEntryRowId: {
                        index: args.index,
                        timeEntryRowId: args.timeEntryRowId,
                    },
                },
                rejectOnNotFound: true,
            });
        },
    }),
}));

builder.mutationFields((t) => ({
    createTimeEntry: t.prismaField({
        type: "TimeEntry",
        args: {
            timeEntryRowId: t.arg.string({ required: true }),
            index: t.arg.int({ required: true }),
            hours: t.arg.float({ required: true }),
            date: t.arg({
                type: "Date",
                required: true,
            }),
        },
        resolve: async (query, root, args, ctx, info) => {
            return await prisma.timeEntry.create({
                data: {
                    hours: args.hours,
                    date: args.date,
                    index: args.index,
                    timeEntryRowId: args.timeEntryRowId,
                },
            });
        },
    }),
    updateTimeEntry: t.prismaField({
        type: "TimeEntry",
        args: {
            id: t.arg.string({ required: true }),
            hours: t.arg.float({ required: true }),
        },
        resolve: async (query, root, args, ctx, info) => {
            return await prisma.timeEntry.update({
                ...query,
                where: {
                    id: args.id,
                },
                data: {
                    hours: args.hours,
                },
            });
        },
    }),
    deleteTimeEntry: t.prismaField({
        type: "TimeEntry",
        args: {
            id: t.arg.string({ required: true }),
        },
        resolve: async (query, root, args, ctx, info) => {
            return await prisma.timeEntry.delete({
                ...query,
                where: {
                    id: args.id,
                },
            });
        },
    }),
}));
