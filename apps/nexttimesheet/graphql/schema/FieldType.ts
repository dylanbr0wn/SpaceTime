import { FieldType } from "@prisma/client";

import { builder } from "../builder";

builder.enumType(FieldType, {
    name: "FieldType",
});
