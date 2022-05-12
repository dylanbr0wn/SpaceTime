import {
    arg,
    extendType,
    inputObjectType,
    nonNull,
    objectType,
    stringArg,
} from "nexus";
import * as NexusPrisma from "nexus-prisma";

import { Context } from "../context";

export const User = objectType({
    name: NexusPrisma.User.$name,
    description: NexusPrisma.User.$description,
    definition(t) {
        t.field(NexusPrisma.User.id);
        t.field(NexusPrisma.User.email);
        t.field(NexusPrisma.User.auth0Id);
        t.field(NexusPrisma.User.code);
        t.field(NexusPrisma.User.isActive);
        t.field(NexusPrisma.User.isAdmin);
        t.field(NexusPrisma.User.tenant);
        t.field(NexusPrisma.User.name);
        t.field(NexusPrisma.User.avatar);
        // t.field(NexusPrisma.User.profile);
        t.field(NexusPrisma.User.createdAt);
        t.field(NexusPrisma.User.updatedAt);
        t.field(NexusPrisma.User.department);
        t.field(NexusPrisma.User.managees);
        t.field(NexusPrisma.User.manager);
        t.field(NexusPrisma.User.isPaymentManager);
        t.field(NexusPrisma.User.isManager);
    },
});

export const QueryUsers = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("allUsers", {
            type: "User",
            resolve: (_parent, _args, context: Context) => {
                return context.prisma.user.findMany();
            },
        });
        t.nonNull.list.nonNull.field("managers", {
            type: "User",
            args: {
                tenantId: nonNull(stringArg()),
            },
            resolve: (_parent, args, context: Context) => {
                return context.prisma.user.findMany({
                    where: {
                        isManager: true,
                        tenant: {
                            id: args.tenantId,
                        },
                    },
                });
            },
        });
        t.field("getUserFromToken", {
            type: "User",
            args: {
                token: nonNull(arg(NexusPrisma.OneTimeToken.id)),
            },
            resolve: async (_parent, args, context: Context) => {
                const user = await context.prisma.oneTimeToken.findUnique({
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
        });
        t.field("getUserFromAuth0", {
            type: "User",
            args: {
                auth0Id: nonNull(arg(NexusPrisma.User.auth0Id)),
            },
            resolve: (_parent, args, context: Context) => {
                return context.prisma.user.findUnique({
                    where: {
                        auth0Id: args.auth0Id,
                    },
                });
            },
        });
        t.field("getUserFromCode", {
            type: "User",
            args: {
                code: nonNull(arg(NexusPrisma.User.code)),
                tenantId: nonNull(stringArg()),
            },
            resolve: (_parent, args, context: Context) => {
                return context.prisma.user.findUnique({
                    where: {
                        code_tenantId: {
                            code: args.code,
                            tenantId: args.tenantId,
                        },
                    },
                });
            },
        });
    },
});

export const MutateUsers = extendType({
    type: "Mutation",
    definition(t) {
        t.field("attachAuth0Id", {
            type: "User",
            args: {
                auth0Id: nonNull(arg(NexusPrisma.User.auth0Id)),
                userId: nonNull(arg(NexusPrisma.User.id)),
            },
            resolve: async (_parent, args, context: Context) => {
                await context.prisma.oneTimeToken.deleteMany({
                    where: {
                        user: {
                            id: args.userId,
                        },
                    },
                });

                return await context.prisma.user.update({
                    where: {
                        id: args.userId,
                    },
                    data: {
                        auth0Id: args.auth0Id,
                    },
                });
            },
        });

        t.field("createUser", {
            type: "User",
            args: {
                user: nonNull(arg({ type: UserCreateInput })),
            },
            resolve: async (_parent, { user }, context: Context) => {
                const userExists = await context.prisma.user.findUnique({
                    where: {
                        code_tenantId: {
                            code: user.code,
                            tenantId: user.tenantId,
                        },
                    },
                });

                if (userExists) throw Error("Code already exists");

                return context.prisma.user.create({
                    data: {
                        email: user.email,
                        auth0Id: user.auth0Id,
                        tenant: {
                            connect: {
                                id: user.tenantId,
                            },
                        },
                        code: user.code,
                        isActive: user.isActive,
                        isAdmin: user.isAdmin,
                        name: user.name,
                        department: {
                            connect: {
                                id: user.departmentId,
                            },
                        },
                        manager: {
                            connect: {
                                id: user.managerId,
                            },
                        },
                        isPaymentManager: user.isPaymentManager,
                        isManager: user.isManager,
                    },
                });
            },
        });

        t.field("updateUser", {
            type: "User",
            args: {
                user: nonNull(arg({ type: UserUpdateInput })),
            },
            resolve: (_parent, { user }, context: Context) => {
                return context.prisma.user.update({
                    where: {
                        id: user.id,
                    },
                    data: {
                        email: user.email,
                        code: user.code,
                        isActive: user.isActive,
                        isAdmin: user.isAdmin,
                        department: {
                            connect: {
                                id: user.departmentId,
                            },
                        },
                        manager: {
                            connect: {
                                id: user.managerId,
                            },
                        },
                        isPaymentManager: user.isPaymentManager,
                        isManager: user.isManager,
                    },
                });
            },
        });
    },
});

export const UserCreateInput = inputObjectType({
    name: "UserCreateInput",
    description: "User Create Input",
    definition(t) {
        t.nonNull.field(NexusPrisma.User.code);
        t.field(NexusPrisma.User.email);
        t.nonNull.field(NexusPrisma.User.tenantId);
        t.nonNull.field(NexusPrisma.User.auth0Id);
        t.nonNull.field(NexusPrisma.User.isActive);
        t.nonNull.field(NexusPrisma.User.isAdmin);
        t.nonNull.field(NexusPrisma.User.departmentId);
        t.nonNull.field(NexusPrisma.User.managerId);
        t.nonNull.field(NexusPrisma.User.isPaymentManager);
        t.nonNull.field(NexusPrisma.User.isManager);
        t.field(NexusPrisma.User.name);
        t.field(NexusPrisma.User.avatar);
    },
});

export const UserUpdateInput = inputObjectType({
    name: "UserUpdateInput",
    description: "User Update Input",
    definition(t) {
        t.nonNull.field(NexusPrisma.User.id);
        t.nonNull.field(NexusPrisma.User.code);
        t.nonNull.field(NexusPrisma.User.auth0Id);
        t.nonNull.field(NexusPrisma.User.email);
        t.nonNull.field(NexusPrisma.User.isActive);
        t.nonNull.field(NexusPrisma.User.isAdmin);
        t.nonNull.field(NexusPrisma.User.departmentId);
        t.nonNull.field(NexusPrisma.User.managerId);
        t.nonNull.field(NexusPrisma.User.isPaymentManager);
        t.nonNull.field(NexusPrisma.User.isManager);
    },
});
