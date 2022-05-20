import { EventType, Status } from "@prisma/client";

import prisma from "../../prisma";
import { builder } from "../builder";

builder.prismaObject("StatusEvent", {
    findUnique: (statusEvent) => ({ id: statusEvent.id }),
    fields: (t) => ({
        id: t.exposeID("id"),
        createdAt: t.field({
            type: "Date",
            resolve: (statusEvent) => statusEvent.createdAt,
        }),
        status: t.field({
            type: Status,
            resolve: (statusEvent) => statusEvent.status,
        }),
        user: t.relation("user"),
        type: t.field({
            type: EventType,
            resolve: (statusEvent) => statusEvent.type,
        }),
        message: t.string({
            nullable: true,
            resolve: (statusEvent) => statusEvent.message,
        }),
    }),
});

builder.queryFields((t) => ({
    statusEvents: t.prismaField({
        type: ["StatusEvent"],
        args: {
            timesheetId: t.arg.string({ required: true }),
        },
        resolve: async (query, root, args, ctx, info) => {
            return await prisma.statusEvent.findMany({
                ...query,
                where: {
                    timesheet: {
                        id: args.timesheetId,
                    },
                },
            });
        },
    }),
}));

builder.mutationFields((t) => ({
    createStatusEvent: t.prismaField({
        type: "StatusEvent",
        args: {
            timesheetId: t.arg.string({ required: true }),
            status: t.arg({
                type: Status,
                required: true,
            }),
            message: t.arg.string({ required: false }),
            userId: t.arg.string({ required: true }),
            type: t.arg({
                type: EventType,
                required: true,
            }),
        },
        resolve: async (query, root, args, ctx, info) => {
            return await prisma.statusEvent.create({
                data: {
                    timesheet: {
                        connect: {
                            id: args.timesheetId,
                        },
                    },
                    status: args.status,
                    message: args.message,
                    user: {
                        connect: {
                            id: args.userId,
                        },
                    },
                    type: args.type,
                },
            });
        },
    }),
}));
