import {
    booleanArg,
    extendType,
    intArg,
    nonNull,
    objectType,
    stringArg,
} from "nexus";
import * as NexusPrisma from "nexus-prisma";

export const Tenant = objectType({
    name: NexusPrisma.Tenant.$name,
    description: NexusPrisma.Tenant.$description,
    definition(t) {
        t.field(NexusPrisma.Tenant.id);
        t.field(NexusPrisma.Tenant.createdAt);
        t.field(NexusPrisma.Tenant.updatedAt);
        t.field(NexusPrisma.Tenant.isActive);
        t.field(NexusPrisma.Tenant.startDate);
        t.field(NexusPrisma.Tenant.periodLength);
        t.field(NexusPrisma.Tenant.name);
        t.field(NexusPrisma.Tenant.description);
        t.field(NexusPrisma.Tenant.logo);
    },
});

export const QueryTenant = extendType({
    type: "Query",
    definition(t) {
        t.field("tenantFromId", {
            type: Tenant,
            args: {
                tenantId: nonNull(stringArg()),
            },
            resolve: (_parent, args, ctx) => {
                return ctx.prisma.tenant.findUnique({
                    where: {
                        id: args.tenantId,
                    },
                });
            },
        });
    },
});

export const MutationTenant = extendType({
    type: "Mutation",
    definition(t) {
        t.field("createTenant", {
            type: Tenant,
            args: {
                name: nonNull(stringArg()),
                description: nonNull(stringArg()),
                logo: nonNull(stringArg()),
                isActive: nonNull(booleanArg()),
                startDate: nonNull(stringArg()),
                periodLength: nonNull(intArg()),
            },
            resolve: (_parent, args, ctx) => {
                return ctx.prisma.tenant.create({
                    data: {
                        name: args.name,
                        description: args.description,
                        logo: args.logo,
                        isActive: args.isActive,
                        startDate: args.startDate,
                        periodLength: args.periodLength,
                    },
                });
            },
        });
        // t.field("updateTenant", {
        //     type: Tenant,
        //     args: {
        //         id: nonNull(stringArg()),
        //         name: stringArg(),
        //         description: stringArg(),
        //         logo: stringArg(),
        //         isActive: booleanArg(),
        //         startDate: stringArg(),
        //         periodLength: stringArg(),
        //     },
        //     resolve: (_parent, args, ctx) => {
        //         return ctx.prisma.tenant.update({
        //             where: {
        //                 id: args.id,
        //             },
        //             data: {
        //                 name: args.name,
        //                 description: args.description,
        //                 logo: args.logo,
        //                 isActive: args.isActive,
        //                 startDate: args.startDate,
        //                 periodLength: args.periodLength,
        //             },
        //         });
        //     },
        // });
    },
});
