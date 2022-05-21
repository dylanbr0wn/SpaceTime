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
import "./Date";
import "./Errors";

import { builder } from "../builder";
builder.queryType({});
builder.mutationType({});

const schema = builder.toSchema({});

export default schema;
