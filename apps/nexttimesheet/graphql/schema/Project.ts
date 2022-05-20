import prisma from "../../prisma";
import { builder } from "../builder";

builder.prismaObject("Project", {
    findUnique: (project) => ({ id: project.id }),
    fields: (t) => ({
        id: t.exposeID("id"),
        createdAt: t.field({
            type: "Date",
            resolve: (project) => project.createdAt,
        }),
        updatedAt: t.field({
            type: "Date",
            resolve: (project) => project.updatedAt,
        }),
        name: t.exposeString("name"),
        description: t.string({
            nullable: true,
            resolve: (project) => project.description,
        }),
        tenant: t.relation("tenant"),
        code: t.exposeString("code"),
        department: t.relation("department"),
        isActive: t.exposeBoolean("isActive"),
    }),
});

builder.queryFields((t) => ({
    projects: t.prismaField({
        type: ["Project"],
        args: {
            tenantId: t.arg.string({ required: true }),
        },
        resolve: async (query, root, args, ctx, info) => {
            return await prisma.project.findMany({
                ...query,
                where: {
                    tenant: {
                        id: args.tenantId,
                    },
                },
            });
        },
    }),
    project: t.prismaField({
        type: "Project",
        args: {
            id: t.arg.string({ required: true }),
        },
        resolve: async (query, root, args, ctx, info) => {
            return await prisma.project.findUnique({
                ...query,
                rejectOnNotFound: true,
                where: {
                    id: args.id,
                },
            });
        },
    }),
}));
