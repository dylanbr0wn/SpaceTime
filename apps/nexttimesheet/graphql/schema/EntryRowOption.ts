import prisma from "../../prisma";
import { builder } from "../builder";

builder.prismaObject("EntryRowOption", {
    findUnique: (field) => ({ id: field.id }),
    fields: (t) => ({
        id: t.exposeID("id"),
        createdAt: t.field({
            type: "Date",
            resolve: (department) => department.createdAt,
        }),
        updatedAt: t.field({
            type: "Date",
            resolve: (department) => department.updatedAt,
        }),
        entryRow: t.relation("timeEntryRow"),
        fieldOption: t.relation("fieldOption"),
    }),
});

builder.queryFields((t) => ({
    entryRowOption: t.prismaField({
        type: "EntryRowOption",
        args: {
            rowId: t.arg.string({ required: true }),
            fieldId: t.arg.string({ required: true }),
        },
        resolve: async (query, root, args, ctx, info) => {
            return await prisma.entryRowOption.findUnique({
                ...query,
                rejectOnNotFound: true,
                where: {
                    fieldId_timeEntryRowId: {
                        timeEntryRowId: args.rowId,
                        fieldId: args.fieldId,
                    },
                },
            });
        },
    }),
}));

builder.mutationFields((t) => ({
    updateEntryRowOption: t.prismaField({
        type: "EntryRowOption",
        args: {
            rowId: t.arg.string({ required: true }),
            fieldId: t.arg.string({ required: true }),
            fieldOptionId: t.arg.string({ required: true }),
        },
        resolve: async (query, root, args, ctx, info) => {
            return await prisma.entryRowOption.upsert({
                ...query,
                where: {
                    fieldId_timeEntryRowId: {
                        timeEntryRowId: args.rowId,
                        fieldId: args.fieldId,
                    },
                },
                update: {
                    fieldOptionId: args.fieldOptionId,
                },
                create: {
                    timeEntryRowId: args.rowId,
                    fieldId: args.fieldId,
                    fieldOptionId: args.fieldOptionId,
                },
            });
        },
    }),
}));
