import { EventType } from "@prisma/client";

import { builder } from "../builder";

builder.enumType(EventType, {
    name: "EventType",
});
