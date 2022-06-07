import prisma from "../../prisma";
import { builder } from "../builder";

builder.prismaObject("Tenant", {
    findUnique: (tenant) => ({ id: tenant.id }),
    fields: (t) => ({
        id: t.exposeID("id"),
        createdAt: t.field({
            type: "Date",
            resolve: (tenant) => tenant.createdAt,
        }),
        updatedAt: t.field({
            type: "Date",
            resolve: (tenant) => tenant.updatedAt,
        }),
        name: t.exposeString("name"),
        description: t.string({
            nullable: true,
            resolve: (tenant) => tenant.description,
        }),
        isActive: t.exposeBoolean("isActive"),
        users: t.relation("users"),
        startDate: t.field({
            type: "Date",
            resolve: (tenant) => tenant.startDate,
        }),
        periodLength: t.exposeInt("periodLength"),
        logo: t.string({
            nullable: true,
            resolve: (tenant) => tenant.logo,
        }),
        tenantActivefields: t.relation("tenantActivefields"),
    }),
});

builder.queryFields((t) => ({
    tenant: t.prismaField({
        type: "Tenant",
        args: {
            id: t.arg.string({ required: true }),
        },
        resolve: async (query, root, args, ctx, info) => {
            return await prisma.tenant.findUnique({
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
    createTenant: t.prismaField({
        type: "Tenant",
        args: {
            name: t.arg.string({ required: true }),
            description: t.arg.string(),
            isActive: t.arg.boolean({ required: true }),
            startDate: t.arg({
                type: "Date",
                required: true,
            }),
            periodLength: t.arg.int({ required: true }),
            logo: t.arg.string(),
        },
        resolve: async (query, root, args, ctx, info) => {
            return await prisma.tenant.create({
                data: {
                    ...args,
                },
            });
        },
    }),
    updateTenant: t.prismaField({
        type: "Tenant",
        args: {
            id: t.arg.string({ required: true }),
            name: t.arg.string(),
            description: t.arg.string(),
            isActive: t.arg.boolean(),
            periodLength: t.arg.int(),
            logo: t.arg.string(),
        },
        resolve: async (query, root, args, ctx, info) => {
            return await prisma.tenant.update({
                ...query,
                where: {
                    id: args.id,
                },
                data: {
                    name: args.name ?? undefined,
                    description: args.description,
                    isActive:
                        args.isActive === null ? undefined : args.isActive,
                    periodLength: args.periodLength ?? undefined,
                    logo: args.logo,
                },
            });
        },
    }),
    deleteTenant: t.prismaField({
        type: "Tenant",
        args: {
            id: t.arg.string({ required: true }),
        },
        resolve: async (query, root, args, ctx, info) => {
            return await prisma.tenant.delete({
                ...query,
                where: {
                    id: args.id,
                },
            });
        },
    }),
}));
