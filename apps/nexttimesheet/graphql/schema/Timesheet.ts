import { DateTime, Interval } from "luxon";

import { Status } from "@prisma/client";

import prisma from "../../prisma";
import { builder } from "../builder";

builder.prismaObject("Timesheet", {
    findUnique: (timesheet) => ({ id: timesheet.id }),
    fields: (t) => ({
        id: t.exposeID("id"),
        createdAt: t.field({
            type: "Date",
            resolve: (timesheet) => timesheet.createdAt,
        }),
        updatedAt: t.field({
            type: "Date",
            resolve: (timesheet) => timesheet.updatedAt,
        }),
        user: t.relation("user"),
        period: t.relation("period"),
        timeEntryRows: t.relation("timeEntryRows"),
        isChanged: t.exposeBoolean("isChanged"),
        status: t.field({
            type: Status,
            resolve: (timesheet) => timesheet.status,
        }),
    }),
});

builder.queryFields((t) => ({
    timesheet: t.prismaField({
        type: "Timesheet",
        args: {
            id: t.arg.string({ required: true }),
        },
        resolve: async (query, root, args, ctx, info) => {
            return await prisma.timesheet.findUnique({
                ...query,
                rejectOnNotFound: true,
                where: {
                    id: args.id,
                },
            });
        },
    }),
    timesheetFromDate: t.prismaField({
        type: "Timesheet",
        args: {
            userId: t.arg.string({ required: true }),
            date: t.arg({
                type: "Date",
                required: true,
            }),
        },
        resolve: async (query, root, args, ctx, info) => {
            let period = await prisma.period.findFirst({
                where: {
                    startDate: {
                        lte: args.date,
                    },
                    endDate: {
                        gt: args.date,
                    },
                },
            });
            const user = await prisma.user.findUnique({
                where: {
                    id: args.userId,
                },
                include: {
                    tenant: {
                        select: {
                            startDate: true,
                            periodLength: true,
                        },
                    },
                },
            });

            if (!period && user?.tenant && user?.tenantId) {
                // got prefs, find the period params
                const timesheetDate = DateTime.fromJSDate(args.date);
                const { startDate, periodLength } = user.tenant;
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

                period = await prisma.period.create({
                    data: {
                        startDate: interval.start.toJSDate(),
                        endDate: interval.end.toJSDate(),
                        tenant: {
                            connect: {
                                id: user?.tenantId,
                            },
                        },
                    },
                });
            }
            if (!period) throw new Error("Could not find or create period");
            // now have period, find or create timesheet

            return await prisma.timesheet.upsert({
                where: {
                    userId_periodId: {
                        userId: args.userId,
                        periodId: period.id,
                    },
                },
                update: {},
                create: {
                    userId: args.userId,
                    periodId: period.id,
                },
            });
        },
    }),
}));

builder.mutationFields((t) => ({
    updateTimesheet: t.prismaField({
        type: "Timesheet",
        args: {
            id: t.arg.string({ required: true }),
            isChanged: t.arg.boolean({ required: true }),
        },
        resolve: async (query, root, args, ctx, info) => {
            return await prisma.timesheet.update({
                where: {
                    id: args.id,
                },
                data: {
                    isChanged: args.isChanged,
                },
            });
        },
    }),
}));
