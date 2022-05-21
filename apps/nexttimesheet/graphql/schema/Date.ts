import { DateTimeResolver } from "graphql-scalars";

import { builder } from "../builder";
builder.addScalarType("Date", DateTimeResolver, {});
