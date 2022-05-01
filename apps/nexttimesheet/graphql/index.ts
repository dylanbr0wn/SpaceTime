import path from "path";

import { DateTimeResolver } from "graphql-scalars";
import { asNexusMethod, makeSchema } from "nexus";

import * as Department from "./schema/Department";
import * as EntryComment from "./schema/EntryComment";
import * as Period from "./schema/Period";
import * as Project from "./schema/Project";
import * as Tenant from "./schema/Tenant";
import * as TimeEntry from "./schema/TimeEntry";
import * as TimeEntryRow from "./schema/TimeEntryRow";
import * as Timesheet from "./schema/Timesheet";
import * as User from "./schema/User";
import * as Worktype from "./schema/WorkType";

export const DateTime = asNexusMethod(DateTimeResolver, "date"); // it will break without this....b
export const schema = makeSchema({
    types: {
        Tenant,
        Department,
        EntryComment,
        Period,
        // Profile,
        Project,
        TimeEntry,
        TimeEntryRow,
        Timesheet,
        User,
        Worktype,
        DateTime,
    },
    outputs: {
        schema: path.join(process.cwd(), "graphql/schema.graphql"),
        typegen: path.join(
            process.cwd(),
            "/node_modules/@types/nexus-typegen/index.d.ts"
        ),
    },

    contextType: {
        module: path.join(process.cwd(), "graphql/context"),
        export: "Context",
    },
    sourceTypes: {
        modules: [
            {
                module: "@prisma/client",
                alias: "prisma",
            },
        ],
    },
});
