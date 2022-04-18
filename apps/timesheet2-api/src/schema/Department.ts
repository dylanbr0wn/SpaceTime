import { objectType } from "nexus";
import * as NexusPrisma from "nexus-prisma";

export const Department = objectType({
    name: NexusPrisma.Department.$name,
    description: NexusPrisma.Department.$description,
    definition(t) {
        t.field(NexusPrisma.Department.id);
        t.field(NexusPrisma.Department.name);
        t.field(NexusPrisma.Department.createdAt);
        t.field(NexusPrisma.Department.updatedAt);
        t.field(NexusPrisma.Department.users);
        t.field(NexusPrisma.Department.isActive);
        t.field(NexusPrisma.Department.description);
        t.field(NexusPrisma.Department.projects);
    },
});
