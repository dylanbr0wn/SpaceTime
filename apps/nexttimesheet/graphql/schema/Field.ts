import { FieldType } from "@prisma/client";

import prisma from "../../prisma";
import { builder } from "../builder";

builder.prismaObject("Field", {
    findUnique: (field) => ({ id: field.id }),
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
        fieldOptions: t.relation("fieldOptions"),
        isActive: t.exposeBoolean("isActive"),
        fieldType: t.field({
            type: FieldType,
            resolve: (field) => field.fieldType,
        }),
    }),
});

builder.queryFields((t) => ({
    fields: t.prismaField({
        type: ["Field"],
        args: {
            tenantId: t.arg.string({ required: true }),
        },
        resolve: async (query, root, args, ctx, info) => {
            return await prisma.field.findMany({
                ...query,
                where: {
                    tenant: {
                        id: args.tenantId,
                    },
                },
            });
        },
    }),
    field: t.prismaField({
        type: "Field",
        args: {
            id: t.arg.string({ required: true }),
        },
        resolve: async (query, root, args, ctx, info) => {
            return await prisma.field.findUnique({
                ...query,
                rejectOnNotFound: true,
                where: {
                    id: args.id,
                },
            });
        },
    }),
}));
