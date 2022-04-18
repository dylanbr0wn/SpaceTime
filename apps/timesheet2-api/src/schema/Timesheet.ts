import { extendType, intArg, objectType } from "nexus";
import * as NexusPrisma from "nexus-prisma";

import { Context } from "../context";

export const Timesheet = objectType({
    name: NexusPrisma.Timesheet.$name,
    definition(t) {
        t.field(NexusPrisma.Timesheet.id);
        t.field(NexusPrisma.Timesheet.createdAt);
        t.field(NexusPrisma.Timesheet.updatedAt);
        t.field(NexusPrisma.Timesheet.period);
        t.field(NexusPrisma.Timesheet.user);
        t.field(NexusPrisma.Timesheet.timeEntryRows);
    },
});

export const getTimesheet = extendType({
    type: "Query",
    definition(t) {
        t.field("timesheet", {
            type: Timesheet,
            args: {
                periodId: intArg(),
                userId: intArg(),
            },
            resolve: (_parent, args, context: Context) => {
                return context.prisma.timesheet.findFirst({
                    where: {
                        period: {
                            id: args.periodId ?? undefined,
                        },
                        user: {
                            id: args.userId ?? undefined,
                        },
                    },
                });
            },
        });
    },
});
