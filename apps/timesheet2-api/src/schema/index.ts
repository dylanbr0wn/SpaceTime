import path from "path";

import { DateTimeResolver } from "graphql-scalars";
import { asNexusMethod, makeSchema } from "nexus";

import * as Department from "./Department";
import * as EntryComment from "./EntryComment";
import * as Period from "./Period";
import * as Project from "./Project";
import * as Tenant from "./Tenant";
import * as TimeEntry from "./TimeEntry";
import * as TimeEntryRow from "./TimeEntryRow";
import * as Timesheet from "./Timesheet";
import * as User from "./User";
import * as Worktype from "./WorkType";

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
        schema: path.join(__dirname, "/../schema.graphql"),
        typegen: path.join(
            __dirname,
            "../../node_modules/@types/nexus-typegen/index.d.ts"
        ),
    },
    contextType: {
        module: require.resolve("../context"),
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
