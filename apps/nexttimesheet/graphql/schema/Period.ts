import { builder } from "../builder";

builder.prismaObject("Period", {
    findUnique: (period) => ({ id: period.id }),
    fields: (t) => ({
        id: t.exposeID("id"),
        createdAt: t.field({
            type: "Date",
            resolve: (period) => period.createdAt,
        }),
        startDate: t.field({
            type: "Date",
            resolve: (period) => period.startDate,
        }),
        endDate: t.field({
            type: "Date",
            resolve: (period) => period.endDate,
        }),
    }),
});
