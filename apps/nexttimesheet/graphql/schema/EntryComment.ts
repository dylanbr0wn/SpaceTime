import prisma from "../../prisma";
import { builder } from "../builder";

builder.prismaObject("EntryComment", {
    findUnique: (entry) => ({ id: entry.id }),
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
        user: t.relation("user"),
        text: t.exposeString("text"),
    }),
});

builder.queryFields((t) => ({
    entryComments: t.prismaField({
        type: ["EntryComment"],
        args: {
            entryId: t.arg.string({ required: true }),
        },
        resolve: async (query, root, args, ctx, info) => {
            return await prisma.entryComment.findMany({
                ...query,
                where: {
                    timeEntry: {
                        id: args.entryId,
                    },
                },
            });
        },
    }),
    entryComment: t.prismaField({
        type: "EntryComment",
        args: {
            id: t.arg.string({ required: true }),
        },
        resolve: async (query, root, args, ctx, info) => {
            return await prisma.entryComment.findUnique({
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
    createEntryComment: t.prismaField({
        type: "EntryComment",
        args: {
            text: t.arg.string({ required: true }),
            userId: t.arg.string({ required: true }),
            entryId: t.arg.string({ required: true }),
        },
        resolve: async (query, root, args, ctx, info) => {
            return await prisma.entryComment.create({
                ...query,
                data: {
                    text: args.text,
                    user: {
                        connect: {
                            id: args.userId,
                        },
                    },
                    timeEntry: {
                        connect: {
                            id: args.entryId,
                        },
                    },
                },
            });
        },
    }),
    updateEntryComment: t.prismaField({
        type: "EntryComment",
        args: {
            id: t.arg.string({ required: true }),
            text: t.arg.string({ required: true }),
        },
        resolve: async (query, root, args, ctx, info) => {
            return await prisma.entryComment.update({
                ...query,
                where: {
                    id: args.id,
                },
                data: {
                    text: args.text,
                },
            });
        },
    }),
    deleteEntryComment: t.prismaField({
        type: "EntryComment",
        args: {
            id: t.arg.string({ required: true }),
        },
        resolve: async (query, root, args, ctx, info) => {
            return await prisma.entryComment.delete({
                ...query,
                where: {
                    id: args.id,
                },
            });
        },
    }),
}));
