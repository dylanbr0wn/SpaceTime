import { extendType, objectType } from "nexus";
import * as NexusPrisma from "nexus-prisma";

export const Project = objectType({
    name: NexusPrisma.Project.$name,
    description: NexusPrisma.Project.$description,
    definition(t) {
        t.field(NexusPrisma.Project.id);
        t.field(NexusPrisma.Project.name);
        t.field(NexusPrisma.Project.createdAt);
        t.field(NexusPrisma.Project.updatedAt);
        t.field(NexusPrisma.Project.isActive);
        t.field(NexusPrisma.Project.description);
        t.field(NexusPrisma.Project.code);
        t.field(NexusPrisma.Project.department);
    },
});

export const QueryProject = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("projects", {
            type: Project,
            resolve: (_parent, _args, ctx) => {
                return ctx.prisma.project.findMany();
            },
        });
    },
});
