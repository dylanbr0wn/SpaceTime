import prisma from "../../prisma";
import { builder } from "../builder";

builder.prismaObject("WorkType", {
    findUnique: (workType) => ({ id: workType.id }),
    fields: (t) => ({
        id: t.exposeID("id"),
        createdAt: t.field({
            type: "Date",
            resolve: (workType) => workType.createdAt,
        }),
        updatedAt: t.field({
            type: "Date",
            resolve: (workType) => workType.updatedAt,
        }),
        name: t.field({
            type: "String",
            resolve: (workType) => workType.name,
        }),
        description: t.field({
            type: "String",
            nullable: true,
            resolve: (workType) => workType.description,
        }),
        isActive: t.exposeBoolean("isActive"),
        tenant: t.relation("tenant"),
        code: t.exposeString("code"),
        isSystem: t.exposeBoolean("isSystem"),
        isDefault: t.exposeBoolean("isDefault"),
        isBillable: t.exposeBoolean("isBillable"),
        multiplier: t.exposeFloat("multiplier"),
    }),
});

builder.queryFields((t) => ({
    workTypes: t.prismaField({
        type: ["WorkType"],
        args: {
            tenantId: t.arg.string({ required: true }),
        },
        resolve: async (query, root, args, ctx, info) => {
            return await prisma.workType.findMany({
                ...query,
                where: {
                    tenant: {
                        id: args.tenantId,
                    },
                },
            });
        },
    }),
    workType: t.prismaField({
        type: "WorkType",
        args: {
            id: t.arg.string({ required: true }),
        },
        resolve: async (query, root, args, ctx, info) => {
            return await prisma.workType.findUnique({
                ...query,
                rejectOnNotFound: true,
                where: {
                    id: args.id,
                },
            });
        },
    }),
}));
