import prisma from "../../prisma";
import { builder } from "../builder";

builder.prismaObject("FieldOption", {
    findUnique: (field) => ({ id: field.id }),
    fields: (t) => ({
        id: t.exposeID("id"),
        name: t.exposeString("name"),
        createdAt: t.field({
            type: "Date",
            resolve: (department) => department.createdAt,
        }),
        updatedAt: t.field({
            type: "Date",
            resolve: (department) => department.updatedAt,
        }),
        isActive: t.exposeBoolean("isActive"),
        description: t.field({
            type: "String",
            nullable: true,
            resolve: (field) => field.description,

        }),
    }),
});

builder.queryFields((t) => ({
    feildOptions: t.prismaField({
        type: ["FieldOption"],
        args: {
            rowFieldId: t.arg.string({ required: true }),
        },
        resolve: async (query, root, args, ctx, info) => {
            return await prisma.fieldOption.findMany({
                ...query,
                where: {
                    rowFieldId: args.rowFieldId,
                },
            });
        },
    }),
}));
