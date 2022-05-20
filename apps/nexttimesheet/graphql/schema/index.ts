import "./Timesheet";
import "./User";
import "./WorkType";
import "./Department";
import "./EntryComment";
import "./EventType";
import "./OneTimeToken";
import "./Period";
import "./Project";
import "./Status";
import "./StatusEvent";
import "./Tenant";
import "./TimeEntry";
import "./TimeEntryRow";
import "../scalar-types";

import { builder } from "../builder";
builder.queryType({});
builder.mutationType({});

export const schema = builder.toSchema({});
