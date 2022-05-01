import { extendType, objectType } from "nexus";
import * as NexusPrisma from "nexus-prisma";

export const WorkType = objectType({
    name: NexusPrisma.WorkType.$name,
    description: NexusPrisma.WorkType.$description,
    definition(t) {
        t.field(NexusPrisma.WorkType.id);
        t.field(NexusPrisma.WorkType.name);
        t.field(NexusPrisma.WorkType.createdAt);
        t.field(NexusPrisma.WorkType.updatedAt);
        t.field(NexusPrisma.WorkType.isActive);
        t.field(NexusPrisma.WorkType.description);
        t.field(NexusPrisma.WorkType.code);
        t.field(NexusPrisma.WorkType.isSystem);
        t.field(NexusPrisma.WorkType.isDefault);
        t.field(NexusPrisma.WorkType.multiplier);
        t.field(NexusPrisma.WorkType.isBillable);
    },
});

export const QueryWorkType = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("workTypes", {
            type: WorkType,
            resolve: (_parent, _args, ctx) => {
                return ctx.prisma.workType.findMany();
            },
        });
    },
});
