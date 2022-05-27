import { builder } from "../builder";

builder.prismaObject("TimesheetField", {
    findUnique: (field) => ({ id: field.id }),
    fields: (t) => ({
        id: t.exposeID("id"),
        createdAt: t.field({
            type: "Date",
            resolve: (department) => department.createdAt,
        }),
        updatedAt: t.field({
            type: "Date",
            resolve: (department) => department.updatedAt,
        }),
        timesheet: t.relation("timesheet"),
        field: t.relation("field"),
    }),
});
