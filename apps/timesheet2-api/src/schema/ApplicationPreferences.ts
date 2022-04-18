import { extendType, objectType } from "nexus";
import * as NexusPrisma from "nexus-prisma";

export const ApplicationPreferences = objectType({
    name: NexusPrisma.ApplicationPreferences.$name,
    description: NexusPrisma.ApplicationPreferences.$description,
    definition(t) {
        t.field(NexusPrisma.ApplicationPreferences.id);
        t.field(NexusPrisma.ApplicationPreferences.createdAt);
        t.field(NexusPrisma.ApplicationPreferences.updatedAt);
        t.field(NexusPrisma.ApplicationPreferences.isActive);
        t.field(NexusPrisma.ApplicationPreferences.startDate);
        t.field(NexusPrisma.ApplicationPreferences.periodLength);
    },
});

export const QueryApplicationPreferences = extendType({
    type: "Query",
    definition(t) {
        t.field("applicationPreferences", {
            type: ApplicationPreferences,
            resolve: (_parent, _args, ctx) => {
                return ctx.prisma.applicationPreferences.findUnique({
                    where: {
                        id: 1,
                    },
                });
            },
        });
    },
});
