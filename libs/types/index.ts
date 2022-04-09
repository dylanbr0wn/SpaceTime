/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
import { NextFunction, Request, Response } from "express";
import { Moment } from "moment";

export type Settings = {
    CutOffDate: Date;
    HoursPerDay: number;
    RecordID: number;
    SharepointURLForApproval: string;
};

export type TimeEntry = {
    TimeEntryID?: number | null;
    WorkCodeID: number;
    EmployeeID: number;
    ProjectID: number;
    DateofWork: string | Date | Moment;
    Comment: string | null;
    HoursWorked: number;
    SubmissionDate?: null | Date;
    SubmissionID?: null | number;
    DepartmentID?: number;
    DeptName?: string;
    WCName?: string;
    ProjName?: string;
};

export type TimeEntryRow = {
    DepartmentID?: number;
    WorkCodeID: number;
    EmployeeID: number;
    ProjectID: number;
    TimeEntryRowID?: number;
    DeptName?: string;
    WCName?: string;
    ProjName?: string;
    dates: TimeEntry[];
    StartDate?: string | Date | Moment;
};

export type UserInfo = {
    DepartmentID: number;
    DeptName: string;
    DiamondEmpID: string;
    Email: string;
    EmployeeID: number;
    FirstName: string;
    IsActive: boolean;
    IsAdministrator: boolean;
    IsPayrollClerk: boolean;
    IsSupervisor: boolean;
    LastName: string;
    SAMAccountName: string;
    SupervisorID: number;
};

export type WorkCode = {
    Code: string;
    Description: string;
    ExportToDynamics: boolean;
    IsDefault: boolean;
    Multiplier: number;
    WorkCodeID: number;
};

export type Department = {
    DepartmentID: number;
    DeptName: string;
    IsActive: boolean;
};

export type Project = {
    DepartmentID: number;
    DeptCode: string;
    Description: string;
    GLCode: string | null;
    IsActive: boolean;
    Name: string;
    ProjectID: number;
};

export type DayComment = {
    Comment: string;
    DateofComment: Date;
    EmployeeID: number;
    DayCommentID?: number;
};

export interface PassportRequest<T> extends Request<T> {
    user: UserInfo;
}

declare global {
    namespace Express {
        interface User extends UserInfo {}
    }
}

export type Approval = {
    ApprovalID: number | null;
    ApprovalStatus: number | null;
    PayrollComment: string | null;
    SubmissionComment: string | null;
    SubmitCount?: number | null;
    SupervisorComment: string | null;
};

export type Template = {
    EmployeeID: number;
    TemplateID: number;
    TemplateName: string;
};

export type TemplateRow = {
    TemplateID: number;
    WorkCodeID: number;
    ProjectID: number;
    HoursWorked: number;
    DepartmentID?: number | null;
};
export type Preference = {
    PreferenceType: "bool" | "array" | "number";
    PreferenceCode: string;
    Value: string | PinnedRow[] | number | boolean;
    PreferenceName: string;
    PreferenceID: number;
    EmployeeID: number | null;
    Description: string;
};

export type PinnedRow = {
    DepartmentID: number;
    EmployeeID: number;
    EmployeePinnedRowID?: number;
    ProjectID: number;
    WorkCodeID: number;
};

export type Controller = (req: any, res: Response) => Promise<void>;
export type AsyncMiddleware = () => (
    req: any,
    res: Response,
    next: NextFunction
) => Promise<void>;
export type Middleware = () => (
    req: any,
    res: Response,
    next: NextFunction
) => void;
