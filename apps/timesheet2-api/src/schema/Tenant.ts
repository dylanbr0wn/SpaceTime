import { extendType, nonNull, objectType, stringArg } from "nexus";
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
