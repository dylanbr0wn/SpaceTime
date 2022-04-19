import { DateTime, Interval } from "luxon";
import { arg, extendType, inputObjectType, nonNull, objectType } from "nexus";
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

// export const QueryTimesheet = extendType({
//     type: "Query",
//     definition(t) {

//     },
// });

export const MutateTimesheet = extendType({
    type: "Mutation",
    definition(t) {
        t.field("getorCreateTimesheet", {
            type: Timesheet,
            args: {
                Timesheet: nonNull(arg({ type: TimesheetGetInput })),
            },
            resolve: async (_parent, { Timesheet }, context: Context) => {
                // find the period if it exists given a date
                let period = await context.prisma.period.findFirst({
                    where: {
                        startDate: {
                            lte: Timesheet.date,
                        },
                        endDate: {
                            gt: Timesheet.date,
                        },
                    },
                });
                if (!period) {
                    // if the period doesnt exist, create it

                    // find the period params
                    const prefs =
                        await context.prisma.applicationPreferences.findUnique({
                            where: {
                                id: 1,
                            },
                            select: {
                                startDate: true,
                                periodLength: true,
                            },
                        });
                    if (prefs) {
                        // got prefs, find the period params
                        const timesheetDate = DateTime.fromJSDate(
                            Timesheet.date
                        );
                        const { startDate, periodLength } = prefs;
                        let interval = Interval.after(startDate, {
                            days: periodLength,
                        });
                        while (!interval.contains(timesheetDate)) {
                            interval = interval.mapEndpoints((endpoints) =>
                                endpoints.plus({ days: periodLength })
                            );
                            if (
                                interval.start.year >
                                timesheetDate.plus({
                                    years: 5,
                                }).year
                            ) {
                                throw new Error("Cant find date interval");
                            }
                        }
                        // now have period interval, create period

                        period = await context.prisma.period.create({
                            data: {
                                startDate: interval.start.toJSDate(),
                                endDate: interval.end.toJSDate(),
                            },
                        });
                    } else {
                        throw new Error("No period params found");
                    }
                }
                // now have period, find or create timesheet
                if (!period) throw new Error("Could not find or create period");

                return await context.prisma.timesheet.upsert({
                    where: {
                        userId_periodId: {
                            userId: Timesheet.userId,
                            periodId: period.id,
                        },
                    },
                    update: {},
                    create: {
                        userId: Timesheet.userId,
                        periodId: period.id,
                    },
                });
            },
        });
    },
});

export const TimesheetGetInput = inputObjectType({
    name: "TimesheetGetInput",
    definition(t) {
        t.nonNull.field("date", { type: "DateTime" });
        t.nonNull.field(NexusPrisma.Timesheet.userId);
    },
});