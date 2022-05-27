import prisma from "../../prisma";
import { builder } from "../builder";

builder.prismaObject("User", {
    findUnique: (user) => ({ id: user.id }),
    fields: (t) => ({
        id: t.exposeID("id"),
        createdAt: t.field({
            type: "Date",
            resolve: (user) => user.createdAt,
        }),
        updatedAt: t.field({
            type: "Date",
            resolve: (user) => user.updatedAt,
        }),
        name: t.string({
            nullable: true,
            resolve: (user) => user.name,
        }),
        email: t.string({
            nullable: true,
            resolve: (user) => user.email,
        }),
        authId: t.string({
            nullable: true,
            resolve: (user) => user.authId,
        }),
        tenant: t.relation("tenant", { nullable: true }),
        avatar: t.string({
            nullable: true,
            resolve: (user) => user.avatar,
        }),
        isActive: t.exposeBoolean("isActive"),
        isAdmin: t.exposeBoolean("isAdmin"),
        isManager: t.exposeBoolean("isManager"),
        isPaymentManager: t.exposeBoolean("isPaymentManager"),
        isSetup: t.exposeBoolean("isSetup"),
        manager: t.relation("manager", { nullable: true }),
        managees: t.relation("managees", { nullable: true }),
        code: t.string({
            nullable: true,
            resolve: (user) => user.code,
        }),
    }),
});

builder.queryFields((t) => ({
    users: t.prismaField({
        type: ["User"],
        // errors: {},
        args: {
            tenantId: t.arg.string({ required: true }),
        },
        resolve: async (query, root, args, ctx, info) => {
            return await prisma.user.findMany({
                ...query,
                where: {
                    tenant: {
                        id: args.tenantId,
                    },
                },
            });
        },
    }),
    user: t.prismaField({
        type: "User",
        // errors: {},
        args: {
            id: t.arg.string({ required: true }),
        },
        resolve: async (query, root, args, ctx, info) => {
            return await prisma.user.findUnique({
                ...query,
                rejectOnNotFound: true,
                where: {
                    id: args.id,
                },
            });
        },
    }),
    userFromToken: t.prismaField({
        type: "User",
        // errors: {},
        args: {
            token: t.arg.string({ required: true }),
        },
        resolve: async (query, root, args, ctx, info) => {
            const user = await prisma.oneTimeToken.findUnique({
                where: {
                    id: args.token,
                },
                select: {
                    user: true,
                },
            });
            if (!user) {
                throw new Error("Invalid token");
            }
            return user?.user;
        },
    }),
    managers: t.prismaField({
        type: ["User"],
        // errors: {},
        args: {
            tenantId: t.arg.string({ required: true }),
        },
        resolve: async (query, root, args, ctx, info) => {
            return await prisma.user.findMany({
                ...query,
                where: {
                    tenant: {
                        id: args.tenantId,
                    },
                    isManager: true,
                },
            });
        },
    }),
    userFromAuthId: t.prismaField({
        type: "User",
        // errors: {},
        args: {
            authId: t.arg.string({ required: true }),
        },
        resolve: async (query, root, args, ctx, info) => {
            return await prisma.user.findUnique({
                ...query,
                rejectOnNotFound: true,
                where: {
                    authId: args.authId,
                },
            });
        },
    }),
}));

builder.mutationFields((t) => ({
    createUser: t.prismaField({
        type: "User",
        args: {
            name: t.arg.string({ required: true }),
            email: t.arg.string({ required: true }),
            authId: t.arg.string({ required: true }),
            tenantId: t.arg.string(),
            avatar: t.arg.string({ required: false }),
            isActive: t.arg.boolean({ required: false }),
            isAdmin: t.arg.boolean({ required: false }),
            isManager: t.arg.boolean({ required: false }),
            isPaymentManager: t.arg.boolean({ required: false }),
            isSetup: t.arg.boolean({ required: false }),
            managerId: t.arg.string({ required: false }),
            code: t.arg.string({ required: false }),
        },
        resolve: async (query, root, args, ctx, info) => {
            const user = await prisma.user.create({
                ...query,
                data: {
                    isActive: args.isActive ?? undefined,
                    isAdmin: args.isAdmin ?? undefined,
                    isManager: args.isManager ?? undefined,
                    isPaymentManager: args.isPaymentManager ?? undefined,
                    isSetup: args.isSetup ?? undefined,
                    name: args.name,
                    email: args.email,
                    authId: args.authId,
                    avatar: args.avatar,
                    code: args.code,
                    tenantId: args.tenantId ?? undefined,
                },
            });
            return user;
        },
    }),
    createUserBasic: t.prismaField({
        type: "User",
        args: {
            name: t.arg.string({ required: true }),
            email: t.arg.string({ required: true }),
            authId: t.arg.string({ required: true }),
            tenantId: t.arg.string({ required: true }),
            avatar: t.arg.string({ required: false }),
        },
        resolve: async (query, root, args, ctx, info) => {
            const user = await prisma.user.create({
                ...query,
                data: {
                    name: args.name,
                    email: args.email,
                    authId: args.authId,
                    avatar: args.avatar,
                    tenant: {
                        connect: {
                            id: args.tenantId,
                        },
                    },
                },
            });
            return user;
        },
    }),

    updateUser: t.prismaField({
        type: "User",
        args: {
            id: t.arg.string({ required: true }),
            name: t.arg.string({ required: false }),
            email: t.arg.string({ required: false }),
            authId: t.arg.string({ required: false }),
            avatar: t.arg.string({ required: false }),
            isActive: t.arg.boolean({ required: false }),
            isAdmin: t.arg.boolean({ required: false }),
            isManager: t.arg.boolean({ required: false }),
            isPaymentManager: t.arg.boolean({ required: false }),
            isSetup: t.arg.boolean({ required: false }),
            managerId: t.arg.string({ required: false }),
            code: t.arg.string({ required: false }),
            tenantId: t.arg.string({ required: false }),
        },
        resolve: async (query, root, args, ctx, info) => {
            const user = await prisma.user.update({
                ...query,
                where: {
                    id: args.id,
                },
                data: {
                    isActive: args.isActive ?? undefined,
                    isAdmin: args.isAdmin ?? undefined,
                    isManager: args.isManager ?? undefined,
                    isPaymentManager: args.isPaymentManager ?? undefined,
                    isSetup: args.isSetup ?? undefined,
                    name: args.name,
                    email: args.email ?? undefined,
                    authId: args.authId,
                    avatar: args.avatar,
                    code: args.code,
                    tenantId: args.tenantId ?? undefined,
                    managerId: args.managerId ?? undefined,
                },
            });
            return user;
        },
    }),
}));
