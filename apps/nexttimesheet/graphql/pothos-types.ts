import type {
    Department,
    EntryComment,
    OneTimeToken,
    Period,
    PinnedRow,
    Prisma,
    Project,
    StatusEvent,
    Tenant,
    TimeEntry,
    TimeEntryRow,
    Timesheet,
    User,
    WorkType,
} from "@prisma/client";
export default interface PrismaTypes {
    User: {
        Name: "User";
        Shape: User;
        Include: Prisma.UserInclude;
        Select: Prisma.UserSelect;
        Where: Prisma.UserWhereUniqueInput;
        Fields:
            | "manager"
            | "managees"
            | "department"
            | "pinnedRows"
            | "entryComments"
            | "timesheets"
            | "tenant"
            | "oneTimeToken"
            | "statusEvents";
        RelationName:
            | "manager"
            | "managees"
            | "department"
            | "pinnedRows"
            | "entryComments"
            | "timesheets"
            | "tenant"
            | "oneTimeToken"
            | "statusEvents";
        ListRelations:
            | "managees"
            | "pinnedRows"
            | "entryComments"
            | "timesheets"
            | "oneTimeToken"
            | "statusEvents";
        Relations: {
            manager: {
                Shape: User | null;
                Types: PrismaTypes["User"];
            };
            managees: {
                Shape: User[];
                Types: PrismaTypes["User"];
            };
            department: {
                Shape: Department | null;
                Types: PrismaTypes["Department"];
            };
            pinnedRows: {
                Shape: PinnedRow[];
                Types: PrismaTypes["PinnedRow"];
            };
            entryComments: {
                Shape: EntryComment[];
                Types: PrismaTypes["EntryComment"];
            };
            timesheets: {
                Shape: Timesheet[];
                Types: PrismaTypes["Timesheet"];
            };
            tenant: {
                Shape: Tenant | null;
                Types: PrismaTypes["Tenant"];
            };
            oneTimeToken: {
                Shape: OneTimeToken[];
                Types: PrismaTypes["OneTimeToken"];
            };
            statusEvents: {
                Shape: StatusEvent[];
                Types: PrismaTypes["StatusEvent"];
            };
        };
    };
    TimeEntry: {
        Name: "TimeEntry";
        Shape: TimeEntry;
        Include: Prisma.TimeEntryInclude;
        Select: Prisma.TimeEntrySelect;
        Where: Prisma.TimeEntryWhereUniqueInput;
        Fields: "timeEntryRow" | "entryComments";
        RelationName: "timeEntryRow" | "entryComments";
        ListRelations: "entryComments";
        Relations: {
            timeEntryRow: {
                Shape: TimeEntryRow;
                Types: PrismaTypes["TimeEntryRow"];
            };
            entryComments: {
                Shape: EntryComment[];
                Types: PrismaTypes["EntryComment"];
            };
        };
    };
    Department: {
        Name: "Department";
        Shape: Department;
        Include: Prisma.DepartmentInclude;
        Select: Prisma.DepartmentSelect;
        Where: Prisma.DepartmentWhereUniqueInput;
        Fields:
            | "tenant"
            | "pinnedRows"
            | "projects"
            | "users"
            | "timeEntryRows";
        RelationName:
            | "tenant"
            | "pinnedRows"
            | "projects"
            | "users"
            | "timeEntryRows";
        ListRelations: "pinnedRows" | "projects" | "users" | "timeEntryRows";
        Relations: {
            tenant: {
                Shape: Tenant;
                Types: PrismaTypes["Tenant"];
            };
            pinnedRows: {
                Shape: PinnedRow[];
                Types: PrismaTypes["PinnedRow"];
            };
            projects: {
                Shape: Project[];
                Types: PrismaTypes["Project"];
            };
            users: {
                Shape: User[];
                Types: PrismaTypes["User"];
            };
            timeEntryRows: {
                Shape: TimeEntryRow[];
                Types: PrismaTypes["TimeEntryRow"];
            };
        };
    };
    WorkType: {
        Name: "WorkType";
        Shape: WorkType;
        Include: Prisma.WorkTypeInclude;
        Select: Prisma.WorkTypeSelect;
        Where: Prisma.WorkTypeWhereUniqueInput;
        Fields: "tenant" | "pinnedRows" | "timeEntryRows";
        RelationName: "tenant" | "pinnedRows" | "timeEntryRows";
        ListRelations: "pinnedRows" | "timeEntryRows";
        Relations: {
            tenant: {
                Shape: Tenant;
                Types: PrismaTypes["Tenant"];
            };
            pinnedRows: {
                Shape: PinnedRow[];
                Types: PrismaTypes["PinnedRow"];
            };
            timeEntryRows: {
                Shape: TimeEntryRow[];
                Types: PrismaTypes["TimeEntryRow"];
            };
        };
    };
    Project: {
        Name: "Project";
        Shape: Project;
        Include: Prisma.ProjectInclude;
        Select: Prisma.ProjectSelect;
        Where: Prisma.ProjectWhereUniqueInput;
        Fields: "department" | "tenant" | "timeEntryRows" | "pinnedRows";
        RelationName: "department" | "tenant" | "timeEntryRows" | "pinnedRows";
        ListRelations: "timeEntryRows" | "pinnedRows";
        Relations: {
            department: {
                Shape: Department;
                Types: PrismaTypes["Department"];
            };
            tenant: {
                Shape: Tenant;
                Types: PrismaTypes["Tenant"];
            };
            timeEntryRows: {
                Shape: TimeEntryRow[];
                Types: PrismaTypes["TimeEntryRow"];
            };
            pinnedRows: {
                Shape: PinnedRow[];
                Types: PrismaTypes["PinnedRow"];
            };
        };
    };
    TimeEntryRow: {
        Name: "TimeEntryRow";
        Shape: TimeEntryRow;
        Include: Prisma.TimeEntryRowInclude;
        Select: Prisma.TimeEntryRowSelect;
        Where: Prisma.TimeEntryRowWhereUniqueInput;
        Fields:
            | "workType"
            | "project"
            | "department"
            | "timesheet"
            | "timeEntries";
        RelationName:
            | "workType"
            | "project"
            | "department"
            | "timesheet"
            | "timeEntries";
        ListRelations: "timeEntries";
        Relations: {
            workType: {
                Shape: WorkType | null;
                Types: PrismaTypes["WorkType"];
            };
            project: {
                Shape: Project | null;
                Types: PrismaTypes["Project"];
            };
            department: {
                Shape: Department | null;
                Types: PrismaTypes["Department"];
            };
            timesheet: {
                Shape: Timesheet;
                Types: PrismaTypes["Timesheet"];
            };
            timeEntries: {
                Shape: TimeEntry[];
                Types: PrismaTypes["TimeEntry"];
            };
        };
    };
    Period: {
        Name: "Period";
        Shape: Period;
        Include: Prisma.PeriodInclude;
        Select: Prisma.PeriodSelect;
        Where: Prisma.PeriodWhereUniqueInput;
        Fields: "timesheets" | "tenant";
        RelationName: "timesheets" | "tenant";
        ListRelations: "timesheets";
        Relations: {
            timesheets: {
                Shape: Timesheet[];
                Types: PrismaTypes["Timesheet"];
            };
            tenant: {
                Shape: Tenant;
                Types: PrismaTypes["Tenant"];
            };
        };
    };
    EntryComment: {
        Name: "EntryComment";
        Shape: EntryComment;
        Include: Prisma.EntryCommentInclude;
        Select: Prisma.EntryCommentSelect;
        Where: Prisma.EntryCommentWhereUniqueInput;
        Fields: "user" | "timeEntry";
        RelationName: "user" | "timeEntry";
        ListRelations: never;
        Relations: {
            user: {
                Shape: User;
                Types: PrismaTypes["User"];
            };
            timeEntry: {
                Shape: TimeEntry;
                Types: PrismaTypes["TimeEntry"];
            };
        };
    };
    PinnedRow: {
        Name: "PinnedRow";
        Shape: PinnedRow;
        Include: Prisma.PinnedRowInclude;
        Select: Prisma.PinnedRowSelect;
        Where: Prisma.PinnedRowWhereUniqueInput;
        Fields: "user" | "project" | "worktype" | "department";
        RelationName: "user" | "project" | "worktype" | "department";
        ListRelations: never;
        Relations: {
            user: {
                Shape: User;
                Types: PrismaTypes["User"];
            };
            project: {
                Shape: Project;
                Types: PrismaTypes["Project"];
            };
            worktype: {
                Shape: WorkType;
                Types: PrismaTypes["WorkType"];
            };
            department: {
                Shape: Department;
                Types: PrismaTypes["Department"];
            };
        };
    };
    Timesheet: {
        Name: "Timesheet";
        Shape: Timesheet;
        Include: Prisma.TimesheetInclude;
        Select: Prisma.TimesheetSelect;
        Where: Prisma.TimesheetWhereUniqueInput;
        Fields: "user" | "period" | "timeEntryRows" | "statusEvents";
        RelationName: "user" | "period" | "timeEntryRows" | "statusEvents";
        ListRelations: "timeEntryRows" | "statusEvents";
        Relations: {
            user: {
                Shape: User;
                Types: PrismaTypes["User"];
            };
            period: {
                Shape: Period;
                Types: PrismaTypes["Period"];
            };
            timeEntryRows: {
                Shape: TimeEntryRow[];
                Types: PrismaTypes["TimeEntryRow"];
            };
            statusEvents: {
                Shape: StatusEvent[];
                Types: PrismaTypes["StatusEvent"];
            };
        };
    };
    Tenant: {
        Name: "Tenant";
        Shape: Tenant;
        Include: Prisma.TenantInclude;
        Select: Prisma.TenantSelect;
        Where: Prisma.TenantWhereUniqueInput;
        Fields:
            | "periods"
            | "users"
            | "departments"
            | "projects"
            | "workTypes"
            | "oneTimeToken";
        RelationName:
            | "periods"
            | "users"
            | "departments"
            | "projects"
            | "workTypes"
            | "oneTimeToken";
        ListRelations:
            | "periods"
            | "users"
            | "departments"
            | "projects"
            | "workTypes"
            | "oneTimeToken";
        Relations: {
            periods: {
                Shape: Period[];
                Types: PrismaTypes["Period"];
            };
            users: {
                Shape: User[];
                Types: PrismaTypes["User"];
            };
            departments: {
                Shape: Department[];
                Types: PrismaTypes["Department"];
            };
            projects: {
                Shape: Project[];
                Types: PrismaTypes["Project"];
            };
            workTypes: {
                Shape: WorkType[];
                Types: PrismaTypes["WorkType"];
            };
            oneTimeToken: {
                Shape: OneTimeToken[];
                Types: PrismaTypes["OneTimeToken"];
            };
        };
    };
    OneTimeToken: {
        Name: "OneTimeToken";
        Shape: OneTimeToken;
        Include: Prisma.OneTimeTokenInclude;
        Select: Prisma.OneTimeTokenSelect;
        Where: Prisma.OneTimeTokenWhereUniqueInput;
        Fields: "user" | "tenant";
        RelationName: "user" | "tenant";
        ListRelations: never;
        Relations: {
            user: {
                Shape: User;
                Types: PrismaTypes["User"];
            };
            tenant: {
                Shape: Tenant;
                Types: PrismaTypes["Tenant"];
            };
        };
    };
    StatusEvent: {
        Name: "StatusEvent";
        Shape: StatusEvent;
        Include: Prisma.StatusEventInclude;
        Select: Prisma.StatusEventSelect;
        Where: Prisma.StatusEventWhereUniqueInput;
        Fields: "timesheet" | "user";
        RelationName: "timesheet" | "user";
        ListRelations: never;
        Relations: {
            timesheet: {
                Shape: Timesheet;
                Types: PrismaTypes["Timesheet"];
            };
            user: {
                Shape: User;
                Types: PrismaTypes["User"];
            };
        };
    };
}
