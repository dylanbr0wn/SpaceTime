import { z } from "zod";

export const zTenant = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().nullable().optional(),
	isActive: z.boolean(),
	periodLength: z.number().min(0),
	logo: z.string().nullable().optional(),
	startDate: z.date(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export type Tenant = z.infer<typeof zTenant>;

export const zPeriod = z.object({
	id: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	tenantId: z.string(),
	startDate: z.date(),
	endDate: z.date(),
});

export type Period = z.infer<typeof zPeriod>;

export const zOneTimeToken = z.object({
	id: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	userId: z.string(),
	tenantId: z.string(),
});

export type OneTimeToken = z.infer<typeof zOneTimeToken>;

export const zEventType = z.enum(["Comment", "StatusChange"]);

export const EventType = zEventType.enum;

export type EventTypeType = typeof zEventType._type;

export const zStatus = z.enum([
	"Unsubmitted",
	"Submitted",
	"ManagerApproved",
	"PaymentApproved",
	"Rejected",
]);

export const Status = zStatus.enum;
export type StatusType = typeof zStatus._type;

export const zStatusEvent = z.object({
	id: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	userId: z.string(),
	timesheetId: z.string(),
	type: zEventType,
	status: zStatus,
	message: z.string().nullable(),
});

export type StatusEvent = z.infer<typeof zStatusEvent>;

export const zEntryComment = z.object({
	id: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	text: z.string(),
});

export type EntryComment = z.infer<typeof zEntryComment>;

export const zTimesheet = z.object({
	id: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	userId: z.string(),
	userAuthId: z.string(),
	periodId: z.string(),
	status: zStatus,
	isChanged: z.boolean(),
});

export type Timesheet = z.infer<typeof zTimesheet>;

export const zEntryRowOption = z.object({
	id: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	fieldOptionId: z.string(),
	timeEntryRowId: z.string(),
	fieldId: z.string(),
});

export type EntryRowOption = z.infer<typeof zEntryRowOption>;

export const zFieldType = z.enum(["Checkbox", "Select"]);

export const FieldType = zFieldType.enum;

export const zTimesheetField = z.object({
	id: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	timesheetId: z.string(),
	fieldId: z.string(),
});

export type TimesheetField = z.infer<typeof zTimesheetField>;

export const zTenantActiveFields = z.object({
	id: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	tenantId: z.string(),
	fieldId: z.string(),
});

export type TenantActiveFields = z.infer<typeof zTenantActiveFields>;

export const zField = z.object({
	id: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	name: z.string(),
	tenantId: z.string(),
	isRequired: z.boolean(),
	isActive: z.boolean(),
	isBillable: z.boolean(),
	isDefault: z.boolean(),
	mulitiplier: z.number(),
	isSystem: z.boolean(),
	description: z.string().optional().nullable(),
});

export type Field = z.infer<typeof zField>;

export const zFieldOption = z.object({
	id: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	rowFieldId: z.string(),
	name: z.string(),
	description: z.string().optional().nullable(),
	isActive: z.boolean(),
	isDefault: z.boolean(),
	code: z.string(),
});

export type FieldOption = z.infer<typeof zFieldOption>;

export const zTimeEntryRow = z.object({
	id: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	timesheetId: z.string(),
});

export type TimeEntryRow = z.infer<typeof zTimeEntryRow>;

export const zTimeEntry = z.object({
	id: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	date: z.date(),
	timeEntryRowId: z.string(),
	index: z.number(),
	hours: z.number(),
});

export type TimeEntry = z.infer<typeof zTimeEntry>;

export const zUser = z.object({
	id: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	authId: z.string().nullable().optional(),
	name: z.string().nullable().optional(),
	email: z.string(),
	isActive: z.boolean(),
	isAdmin: z.boolean(),
	isManager: z.boolean(),
	isPaymentManager: z.boolean(),
	avatar: z.string().nullable().optional(),
	code: z.string().nullable().optional(),
	tenantId: z.string().nullable().optional(),
	managerId: z.string().nullable().optional(),
	isSetup: z.boolean(),
});

export type User = z.infer<typeof zUser>;
