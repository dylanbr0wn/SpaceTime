import { arg, extendType, nonNull, objectType, stringArg } from "nexus";
import * as NexusPrisma from "nexus-prisma";

import { EventType } from "./EventType";
import { Status } from "./Status";

export const StatusEvent = objectType({
    name: NexusPrisma.StatusEvent.$name,
    description: NexusPrisma.StatusEvent.$description,
    definition(t) {
        t.field(NexusPrisma.StatusEvent.id);
        t.field(NexusPrisma.StatusEvent.type);
        t.field(NexusPrisma.StatusEvent.createdAt);
        t.field(NexusPrisma.StatusEvent.status);
        t.field(NexusPrisma.StatusEvent.user);
        t.field(NexusPrisma.StatusEvent.message);
    },
});

export const QueryStatusEvent = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("statusEvents", {
            type: StatusEvent,
            args: {
                timesheetId: nonNull(stringArg()),
            },
            resolve: (_parent, args, ctx) => {
                return ctx.prisma.statusEvent.findMany({
                    where: {
                        timesheetId: args.timesheetId,
                    },
                });
            },
        });
    },
});

export const MutationStatusEvent = extendType({
    type: "Mutation",
    definition(t) {
        t.field("createStatusEvent", {
            type: StatusEvent,
            args: {
                timesheetId: nonNull(stringArg()),
                status: nonNull(arg({ type: Status })),
                message: nonNull(stringArg()),
                userId: nonNull(stringArg()),
                type: nonNull(arg({ type: EventType })),
            },
            resolve: async (_parent, args, ctx) => {
                await ctx.prisma.timesheet.update({
                    where: {
                        id: args.timesheetId,
                    },
                    data: {
                        status: args.status,
                        isChanged: false,
                    },
                });

                return await ctx.prisma.statusEvent.create({
                    data: {
                        timesheetId: args.timesheetId,
                        status: args.status,
                        message: args.message,
                        userId: args.userId,
                        type: args.type,
                    },
                });
            },
        });
    },
});
