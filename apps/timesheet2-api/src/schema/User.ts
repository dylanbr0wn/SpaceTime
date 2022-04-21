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
        t.field(NexusPrisma.User.code);
        t.field(NexusPrisma.User.isActive);
        t.field(NexusPrisma.User.isAdmin);
        t.field(NexusPrisma.User.profile);
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
        t.field("getUserFromId", {
            type: "User",
            args: {
                id: nonNull(stringArg()),
            },
            resolve: (_parent, args, context: Context) => {
                return context.prisma.user.findFirst({
                    where: {
                        id: args.id,
                    },
                });
            },
        });
        t.field("getUserFromEmail", {
            type: "User",
            args: {
                email: nonNull(arg(NexusPrisma.User.email)),
            },
            resolve: (_parent, args, context: Context) => {
                return context.prisma.user.findUnique({
                    where: {
                        email: args.email,
                    },
                });
            },
        });
    },
});

export const MutateUsers = extendType({
    type: "Mutation",
    definition(t) {
        t.field("createUser", {
            type: "User",
            args: {
                user: nonNull(arg({ type: UserCreateInput })),
            },
            resolve: (_parent, { user }, context: Context) => {
                return context.prisma.user.create({
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
                        profile: {
                            create: {
                                firstName: user.firstName,
                                lastName: user.lastName,
                                avatar: user.avatar,
                                bio: user.bio,
                            },
                        },
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
                        profile: {
                            create: {
                                firstName: user.firstName,
                                lastName: user.lastName,
                                avatar: user.avatar,
                                bio: user.bio,
                            },
                        },
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
        t.nonNull.field(NexusPrisma.User.email);
        t.nonNull.field(NexusPrisma.User.isActive);
        t.nonNull.field(NexusPrisma.User.isAdmin);
        t.nonNull.field(NexusPrisma.User.departmentId);
        t.nonNull.field(NexusPrisma.User.managerId);
        t.nonNull.field(NexusPrisma.User.isPaymentManager);
        t.nonNull.field(NexusPrisma.User.isManager);
        t.nonNull.field(NexusPrisma.Profile.lastName);
        t.nonNull.field(NexusPrisma.Profile.firstName);
        t.field(NexusPrisma.Profile.avatar);
        t.field(NexusPrisma.Profile.bio);
    },
});

export const UserUpdateInput = inputObjectType({
    name: "UserUpdateInput",
    description: "User Update Input",
    definition(t) {
        t.nonNull.field(NexusPrisma.User.id);
        t.nonNull.field(NexusPrisma.User.code);
        t.nonNull.field(NexusPrisma.User.email);
        t.nonNull.field(NexusPrisma.User.isActive);
        t.nonNull.field(NexusPrisma.User.isAdmin);
        t.nonNull.field(NexusPrisma.User.departmentId);
        t.nonNull.field(NexusPrisma.User.managerId);
        t.nonNull.field(NexusPrisma.User.isPaymentManager);
        t.nonNull.field(NexusPrisma.User.isManager);
        t.nonNull.field(NexusPrisma.Profile.lastName);
        t.nonNull.field(NexusPrisma.Profile.firstName);
        t.field(NexusPrisma.Profile.avatar);
        t.field(NexusPrisma.Profile.bio);
    },
});
