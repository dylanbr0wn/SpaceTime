import { objectType } from "nexus";
import * as NexusPrisma from "nexus-prisma";

export const OneTimeToken = objectType({
    name: NexusPrisma.OneTimeToken.$name,
    description: NexusPrisma.OneTimeToken.$description,
    definition(t) {
        t.field(NexusPrisma.OneTimeToken.id);
        t.field(NexusPrisma.OneTimeToken.user);
        t.field(NexusPrisma.OneTimeToken.tenant);
        t.field(NexusPrisma.OneTimeToken.createdAt);
        t.field(NexusPrisma.OneTimeToken.updatedAt);
    },
});
