import prisma from "../../prisma";
import { builder } from "../builder";

builder.prismaObject("Department", {
    findUnique: (department) => ({ id: department.id }),
    fields: (t) => ({
        id: t.exposeID("id"),
        name: t.exposeString("name"),
        createdAt: t.field({
            type: "Date",
            resolve: (department) => department.createdAt,
        }),
        tenant: t.relation("tenant"),
        updatedAt: t.field({
            type: "Date",
            resolve: (department) => department.updatedAt,
        }),
        users: t.relation("users"),
        description: t.string({
            nullable: true,
            resolve: (department) => department.description,
        }),
        projects: t.relation("projects"),
        isActive: t.exposeBoolean("isActive"),
    }),
});

builder.queryFields((t) => ({
    departments: t.prismaField({
        type: ["Department"],
        args: {
            tenantId: t.arg.string({ required: true }),
        },
        resolve: async (query, root, args, ctx, info) => {
            return await prisma.department.findMany({
                ...query,
                where: {
                    tenant: {
                        id: args.tenantId,
                    },
                },
            });
        },
    }),
}));
