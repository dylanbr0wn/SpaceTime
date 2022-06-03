import { builder } from "../builder";

builder.prismaObject("TenantActiveField", {
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
        tenant: t.relation("tenant"),
        field: t.relation("field"),
    }),
});
