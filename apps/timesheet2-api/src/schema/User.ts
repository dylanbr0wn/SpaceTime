import {
    booleanArg,
    extendType,
    inputObjectType,
    intArg,
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
        t.field("getUser", {
            type: "User",
            args: {
                id: nonNull(intArg()),
            },
            resolve: (_parent, args, context: Context) => {
                return context.prisma.user.findFirst({
                    where: {
                        id: args.id,
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
                email: nonNull(stringArg()),
                code: nonNull(stringArg()),
                isActive: nonNull(booleanArg()),
                isAdmin: nonNull(booleanArg()),
                profile: nonNull(stringArg()),
                department: nonNull(intArg()),
                manager: nonNull(intArg()),
                isPaymentManager: nonNull(booleanArg()),
                isManager: nonNull(booleanArg()),
            },
            resolve: (_parent, args, context: Context) => {
                return context.prisma.user.create({
                    data: {
                        email: args.email,
                        code: args.code,
                        isActive: args.isActive,
                        isAdmin: args.isAdmin,
                        department: {
                            connect: {
                                id: args.department,
                            },
                        },
                        manager: {
                            connect: {
                                id: args.manager,
                            },
                        },
                        isPaymentManager: args.isPaymentManager,
                        isManager: args.isManager,
                    },
                });
            },
        });

        // t.field("updateUser", {
        //     type: "User",
        //     args: {
        //         id: nonNull(intArg()),
        //         email: stringArg(),
        //         code: stringArg(),
        //         isActive: booleanArg(),
        //         isAdmin: booleanArg(),
        //         profile: stringArg(),
        //         department: intArg(),
        //         manager: intArg(),
        //         isPaymentManager: booleanArg(),
        //         isManager: booleanArg(),
        //     },
        //     resolve: (_parent, args, context: Context) => {
        //         return context.prisma.user.update({
        //             where: {
        //                 id: args.id,
        //             },
        //             data: {
        //                 email: args.email,
        //                 code: args.code,
        //                 isActive: args.isActive,
        //                 isAdmin: args.isAdmin,
        //                 profile: args.profile,
        //             },
        //         });
        //     },
        // });
    },
});

export const UserCreateInput = inputObjectType({
    name: "UserCreateInput",
    description: "User Create Input",
    definition(t) {
        t.field(NexusPrisma.User.code);
        t.field(NexusPrisma.User.email);
        t.field(NexusPrisma.User.isActive);
        t.field(NexusPrisma.User.isAdmin);
        t.field(NexusPrisma.User.profile);
        t.field(NexusPrisma.User.departmentId);
        t.field(NexusPrisma.User.managerId);
        t.field(NexusPrisma.User.isPaymentManager);
        t.field(NexusPrisma.User.isManager);
    },
});
