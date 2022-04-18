import { objectType } from "nexus";
import * as NexusPrisma from "nexus-prisma";

export const Period = objectType({
    name: NexusPrisma.Period.$name,
    description: NexusPrisma.Period.$description,
    definition(t) {
        t.field(NexusPrisma.Period.id);
        t.field(NexusPrisma.Period.createdAt);
        t.field(NexusPrisma.Period.startDate);
        t.field(NexusPrisma.Period.endDate);
    },
});
