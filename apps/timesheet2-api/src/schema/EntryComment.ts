import { objectType } from "nexus";
import * as NexusPrisma from "nexus-prisma";

export const EntryComment = objectType({
    name: NexusPrisma.EntryComment.$name,
    description: NexusPrisma.EntryComment.$description,
    definition(t) {
        t.field(NexusPrisma.EntryComment.id);
        t.field(NexusPrisma.EntryComment.createdAt);
        t.field(NexusPrisma.EntryComment.updatedAt);
        t.field(NexusPrisma.EntryComment.text);
        t.field(NexusPrisma.EntryComment.user);
    },
});
