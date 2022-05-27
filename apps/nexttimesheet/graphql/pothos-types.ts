import type { Prisma, User, TimeEntry, TimeEntryRow, Period, EntryComment, Timesheet, Tenant, OneTimeToken, StatusEvent, EntryRowOption, TimesheetField, Field, FieldOption } from "@prisma/client";
export default interface PrismaTypes {
    User: {
        Name: "User";
        Shape: User;
        Include: Prisma.UserInclude;
        Select: Prisma.UserSelect;
        Where: Prisma.UserWhereUniqueInput;
        Fields: "manager" | "managees" | "entryComments" | "timesheets" | "tenant" | "oneTimeToken" | "statusEvents";
        RelationName: "manager" | "managees" | "entryComments" | "timesheets" | "tenant" | "oneTimeToken" | "statusEvents";
        ListRelations: "managees" | "entryComments" | "timesheets" | "oneTimeToken" | "statusEvents";
        Relations: {
            manager: {
                Shape: User | null;
                Types: PrismaTypes["User"];
            };
            managees: {
                Shape: User[];
                Types: PrismaTypes["User"];
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
    TimeEntryRow: {
        Name: "TimeEntryRow";
        Shape: TimeEntryRow;
        Include: Prisma.TimeEntryRowInclude;
        Select: Prisma.TimeEntryRowSelect;
        Where: Prisma.TimeEntryRowWhereUniqueInput;
        Fields: "entryRowOptions" | "timesheet" | "timeEntries";
        RelationName: "entryRowOptions" | "timesheet" | "timeEntries";
        ListRelations: "entryRowOptions" | "timeEntries";
        Relations: {
            entryRowOptions: {
                Shape: EntryRowOption[];
                Types: PrismaTypes["EntryRowOption"];
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
    Timesheet: {
        Name: "Timesheet";
        Shape: Timesheet;
        Include: Prisma.TimesheetInclude;
        Select: Prisma.TimesheetSelect;
        Where: Prisma.TimesheetWhereUniqueInput;
        Fields: "user" | "period" | "timeEntryRows" | "statusEvents" | "timesheetFields";
        RelationName: "user" | "period" | "timeEntryRows" | "statusEvents" | "timesheetFields";
        ListRelations: "timeEntryRows" | "statusEvents" | "timesheetFields";
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
            timesheetFields: {
                Shape: TimesheetField[];
                Types: PrismaTypes["TimesheetField"];
            };
        };
    };
    Tenant: {
        Name: "Tenant";
        Shape: Tenant;
        Include: Prisma.TenantInclude;
        Select: Prisma.TenantSelect;
        Where: Prisma.TenantWhereUniqueInput;
        Fields: "periods" | "users" | "fields" | "oneTimeToken";
        RelationName: "periods" | "users" | "fields" | "oneTimeToken";
        ListRelations: "periods" | "users" | "fields" | "oneTimeToken";
        Relations: {
            periods: {
                Shape: Period[];
                Types: PrismaTypes["Period"];
            };
            users: {
                Shape: User[];
                Types: PrismaTypes["User"];
            };
            fields: {
                Shape: Field[];
                Types: PrismaTypes["Field"];
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
    EntryRowOption: {
        Name: "EntryRowOption";
        Shape: EntryRowOption;
        Include: Prisma.EntryRowOptionInclude;
        Select: Prisma.EntryRowOptionSelect;
        Where: Prisma.EntryRowOptionWhereUniqueInput;
        Fields: "fieldOption" | "timeEntryRow" | "field";
        RelationName: "fieldOption" | "timeEntryRow" | "field";
        ListRelations: never;
        Relations: {
            fieldOption: {
                Shape: FieldOption;
                Types: PrismaTypes["FieldOption"];
            };
            timeEntryRow: {
                Shape: TimeEntryRow;
                Types: PrismaTypes["TimeEntryRow"];
            };
            field: {
                Shape: Field;
                Types: PrismaTypes["Field"];
            };
        };
    };
    TimesheetField: {
        Name: "TimesheetField";
        Shape: TimesheetField;
        Include: Prisma.TimesheetFieldInclude;
        Select: Prisma.TimesheetFieldSelect;
        Where: Prisma.TimesheetFieldWhereUniqueInput;
        Fields: "timesheet" | "field";
        RelationName: "timesheet" | "field";
        ListRelations: never;
        Relations: {
            timesheet: {
                Shape: Timesheet;
                Types: PrismaTypes["Timesheet"];
            };
            field: {
                Shape: Field;
                Types: PrismaTypes["Field"];
            };
        };
    };
    Field: {
        Name: "Field";
        Shape: Field;
        Include: Prisma.FieldInclude;
        Select: Prisma.FieldSelect;
        Where: Prisma.FieldWhereUniqueInput;
        Fields: "tenant" | "fieldOptions" | "timesheetFields" | "entryRowOptions";
        RelationName: "tenant" | "fieldOptions" | "timesheetFields" | "entryRowOptions";
        ListRelations: "fieldOptions" | "timesheetFields" | "entryRowOptions";
        Relations: {
            tenant: {
                Shape: Tenant;
                Types: PrismaTypes["Tenant"];
            };
            fieldOptions: {
                Shape: FieldOption[];
                Types: PrismaTypes["FieldOption"];
            };
            timesheetFields: {
                Shape: TimesheetField[];
                Types: PrismaTypes["TimesheetField"];
            };
            entryRowOptions: {
                Shape: EntryRowOption[];
                Types: PrismaTypes["EntryRowOption"];
            };
        };
    };
    FieldOption: {
        Name: "FieldOption";
        Shape: FieldOption;
        Include: Prisma.FieldOptionInclude;
        Select: Prisma.FieldOptionSelect;
        Where: Prisma.FieldOptionWhereUniqueInput;
        Fields: "rowField" | "entryRowOption";
        RelationName: "rowField" | "entryRowOption";
        ListRelations: "entryRowOption";
        Relations: {
            rowField: {
                Shape: Field;
                Types: PrismaTypes["Field"];
            };
            entryRowOption: {
                Shape: EntryRowOption[];
                Types: PrismaTypes["EntryRowOption"];
            };
        };
    };
}