import "./Timesheet";
import "./User";
import "./EntryComment";
import "./EventType";
import "./OneTimeToken";
import "./Period";
import "./Field";
import "./Status";
import "./StatusEvent";
import "./Tenant";
import "./TimeEntry";
import "./TimeEntryRow";
import "./Date";
import "./Errors";
import "./FieldType";
import "./FieldOptions";
import "./EntryRowOption";
import "./TimesheetField";
import "./TenantActiveField";

import { builder } from "../builder";
builder.queryType({});
builder.mutationType({});

const schema = builder.toSchema({});

export default schema;
