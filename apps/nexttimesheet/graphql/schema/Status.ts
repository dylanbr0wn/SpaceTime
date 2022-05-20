import { Status } from "@prisma/client";

import { builder } from "../builder";

builder.enumType(Status, {
    name: "Status",
});
