import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Date: Date | string;
};

export type EntryComment = {
  __typename?: 'EntryComment';
  createdAt: Scalars['Date'];
  id: Scalars['ID'];
  text: Scalars['String'];
  updatedAt: Scalars['Date'];
  user: User;
};

export type EntryRowOption = {
  __typename?: 'EntryRowOption';
  createdAt: Scalars['Date'];
  entryRow: TimeEntryRow;
  fieldOption: FieldOption;
  id: Scalars['ID'];
  updatedAt: Scalars['Date'];
};

export enum EventType {
  Comment = 'Comment',
  StatusChange = 'StatusChange'
}

export type Field = {
  __typename?: 'Field';
  createdAt: Scalars['Date'];
  fieldOptions: Array<FieldOption>;
  fieldType: FieldType;
  id: Scalars['ID'];
  isActive: Scalars['Boolean'];
  name: Scalars['String'];
  tenant: Tenant;
  updatedAt: Scalars['Date'];
};

export type FieldOption = {
  __typename?: 'FieldOption';
  createdAt: Scalars['Date'];
  id: Scalars['ID'];
  isActive: Scalars['Boolean'];
  name: Scalars['String'];
  updatedAt: Scalars['Date'];
};

export enum FieldType {
  Checkbox = 'Checkbox',
  Select = 'Select'
}

export type Mutation = {
  __typename?: 'Mutation';
  createEntryComment: EntryComment;
  createOneTimeToken: OneTimeToken;
  createStatusEvent: StatusEvent;
  createTenant: Tenant;
  createTimeEntry: TimeEntry;
  createTimeEntryRow: TimeEntryRow;
  createUser: User;
  createUserBasic: User;
  deleteEntryComment: EntryComment;
  deleteTenant: Tenant;
  deleteTimeEntry: TimeEntry;
  deleteTimeEntryRow: TimeEntryRow;
  updateEntryComment: EntryComment;
  updateEntryRowOption: EntryRowOption;
  updateTenant: Tenant;
  updateTimeEntry: TimeEntry;
  updateTimesheet: Timesheet;
  updateUser: User;
};


export type MutationCreateEntryCommentArgs = {
  entryId: Scalars['String'];
  text: Scalars['String'];
  userId: Scalars['String'];
};


export type MutationCreateOneTimeTokenArgs = {
  tenantId: Scalars['String'];
  userId: Scalars['String'];
};


export type MutationCreateStatusEventArgs = {
  message?: InputMaybe<Scalars['String']>;
  status: Status;
  timesheetId: Scalars['String'];
  type: EventType;
  userId: Scalars['String'];
};


export type MutationCreateTenantArgs = {
  description?: InputMaybe<Scalars['String']>;
  isActive: Scalars['Boolean'];
  logo?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  periodLength: Scalars['Int'];
  startDate: Scalars['Date'];
};


export type MutationCreateTimeEntryArgs = {
  date: Scalars['Date'];
  hours: Scalars['Float'];
  index: Scalars['Int'];
  timeEntryRowId: Scalars['String'];
};


export type MutationCreateTimeEntryRowArgs = {
  timesheetId: Scalars['String'];
};


export type MutationCreateUserArgs = {
  authId: Scalars['String'];
  avatar?: InputMaybe<Scalars['String']>;
  code?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  isActive?: InputMaybe<Scalars['Boolean']>;
  isAdmin?: InputMaybe<Scalars['Boolean']>;
  isManager?: InputMaybe<Scalars['Boolean']>;
  isPaymentManager?: InputMaybe<Scalars['Boolean']>;
  isSetup?: InputMaybe<Scalars['Boolean']>;
  managerId?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  tenantId?: InputMaybe<Scalars['String']>;
};


export type MutationCreateUserBasicArgs = {
  authId: Scalars['String'];
  avatar?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  name: Scalars['String'];
  tenantId: Scalars['String'];
};


export type MutationDeleteEntryCommentArgs = {
  id: Scalars['String'];
};


export type MutationDeleteTenantArgs = {
  id: Scalars['String'];
};


export type MutationDeleteTimeEntryArgs = {
  id: Scalars['String'];
};


export type MutationDeleteTimeEntryRowArgs = {
  id: Scalars['String'];
};


export type MutationUpdateEntryCommentArgs = {
  id: Scalars['String'];
  text: Scalars['String'];
};


export type MutationUpdateEntryRowOptionArgs = {
  fieldId: Scalars['String'];
  fieldOptionId: Scalars['String'];
  rowId: Scalars['String'];
};


export type MutationUpdateTenantArgs = {
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  isActive?: InputMaybe<Scalars['Boolean']>;
  logo?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  periodLength?: InputMaybe<Scalars['Int']>;
};


export type MutationUpdateTimeEntryArgs = {
  hours: Scalars['Float'];
  id: Scalars['String'];
};


export type MutationUpdateTimesheetArgs = {
  id: Scalars['String'];
  isChanged: Scalars['Boolean'];
};


export type MutationUpdateUserArgs = {
  authId?: InputMaybe<Scalars['String']>;
  avatar?: InputMaybe<Scalars['String']>;
  code?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  isActive?: InputMaybe<Scalars['Boolean']>;
  isAdmin?: InputMaybe<Scalars['Boolean']>;
  isManager?: InputMaybe<Scalars['Boolean']>;
  isPaymentManager?: InputMaybe<Scalars['Boolean']>;
  isSetup?: InputMaybe<Scalars['Boolean']>;
  managerId?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  tenantId?: InputMaybe<Scalars['String']>;
};

export type OneTimeToken = {
  __typename?: 'OneTimeToken';
  createdAt: Scalars['Date'];
  id: Scalars['ID'];
  tenant: Tenant;
  updatedAt: Scalars['Date'];
  user: User;
};

export type Period = {
  __typename?: 'Period';
  createdAt: Scalars['Date'];
  endDate: Scalars['Date'];
  id: Scalars['ID'];
  startDate: Scalars['Date'];
};

export type Query = {
  __typename?: 'Query';
  entryComment: EntryComment;
  entryComments: Array<EntryComment>;
  entryRowOption: EntryRowOption;
  feildOptions: Array<FieldOption>;
  field: Field;
  fields: Array<Field>;
  managers: Array<User>;
  oneTimeToken: OneTimeToken;
  oneTimeTokens: Array<OneTimeToken>;
  statusEvents: Array<StatusEvent>;
  tenant: Tenant;
  timeEntry: TimeEntry;
  timeEntryRow: TimeEntryRow;
  timeEntryRows: Array<TimeEntryRow>;
  timesheet: Timesheet;
  timesheetFromDate: Timesheet;
  user: User;
  userFromAuthId: User;
  userFromToken: User;
  users: Array<User>;
};


export type QueryEntryCommentArgs = {
  id: Scalars['String'];
};


export type QueryEntryCommentsArgs = {
  entryId: Scalars['String'];
};


export type QueryEntryRowOptionArgs = {
  fieldId: Scalars['String'];
  rowId: Scalars['String'];
};


export type QueryFeildOptionsArgs = {
  rowFieldId: Scalars['String'];
};


export type QueryFieldArgs = {
  id: Scalars['String'];
};


export type QueryFieldsArgs = {
  tenantId: Scalars['String'];
};


export type QueryManagersArgs = {
  tenantId: Scalars['String'];
};


export type QueryOneTimeTokenArgs = {
  id: Scalars['String'];
};


export type QueryOneTimeTokensArgs = {
  tenantId: Scalars['String'];
};


export type QueryStatusEventsArgs = {
  timesheetId: Scalars['String'];
};


export type QueryTenantArgs = {
  id: Scalars['String'];
};


export type QueryTimeEntryArgs = {
  index: Scalars['Int'];
  timeEntryRowId: Scalars['String'];
};


export type QueryTimeEntryRowArgs = {
  id: Scalars['String'];
};


export type QueryTimeEntryRowsArgs = {
  timesheetId: Scalars['String'];
};


export type QueryTimesheetArgs = {
  id: Scalars['String'];
};


export type QueryTimesheetFromDateArgs = {
  date: Scalars['Date'];
  userId: Scalars['String'];
};


export type QueryUserArgs = {
  id: Scalars['String'];
};


export type QueryUserFromAuthIdArgs = {
  authId: Scalars['String'];
};


export type QueryUserFromTokenArgs = {
  token: Scalars['String'];
};


export type QueryUsersArgs = {
  tenantId: Scalars['String'];
};

export enum Status {
  ManagerApproved = 'ManagerApproved',
  PaymentApproved = 'PaymentApproved',
  Rejected = 'Rejected',
  Submitted = 'Submitted',
  Unsubmitted = 'Unsubmitted'
}

export type StatusEvent = {
  __typename?: 'StatusEvent';
  createdAt: Scalars['Date'];
  id: Scalars['ID'];
  message?: Maybe<Scalars['String']>;
  status: Status;
  type: EventType;
  user: User;
};

export type Tenant = {
  __typename?: 'Tenant';
  createdAt: Scalars['Date'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  isActive: Scalars['Boolean'];
  logo?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  periodLength: Scalars['Int'];
  startDate: Scalars['Date'];
  updatedAt: Scalars['Date'];
  users: Array<User>;
};

export type TimeEntry = {
  __typename?: 'TimeEntry';
  createdAt: Scalars['Date'];
  date: Scalars['Date'];
  entryComments: Array<EntryComment>;
  hours: Scalars['Float'];
  id: Scalars['ID'];
  index: Scalars['Int'];
  updatedAt: Scalars['Date'];
};

export type TimeEntryRow = {
  __typename?: 'TimeEntryRow';
  createdAt: Scalars['Date'];
  id: Scalars['ID'];
  rowOptions: Array<EntryRowOption>;
  timeEntries: Array<TimeEntry>;
  updatedAt: Scalars['Date'];
};

export type Timesheet = {
  __typename?: 'Timesheet';
  createdAt: Scalars['Date'];
  id: Scalars['ID'];
  isChanged: Scalars['Boolean'];
  period: Period;
  status: Status;
  timeEntryRows: Array<TimeEntryRow>;
  timesheetFields: Array<TimesheetField>;
  updatedAt: Scalars['Date'];
  user: User;
};

export type TimesheetField = {
  __typename?: 'TimesheetField';
  createdAt: Scalars['Date'];
  field: Field;
  id: Scalars['ID'];
  timesheet: Timesheet;
  updatedAt: Scalars['Date'];
};

export type User = {
  __typename?: 'User';
  authId?: Maybe<Scalars['String']>;
  avatar?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  createdAt: Scalars['Date'];
  email?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  isActive: Scalars['Boolean'];
  isAdmin: Scalars['Boolean'];
  isManager: Scalars['Boolean'];
  isPaymentManager: Scalars['Boolean'];
  isSetup: Scalars['Boolean'];
  managees?: Maybe<Array<User>>;
  manager?: Maybe<User>;
  name?: Maybe<Scalars['String']>;
  tenant?: Maybe<Tenant>;
  updatedAt: Scalars['Date'];
};

export type TenantQueryVariables = Exact<{
  tenantId: Scalars['String'];
}>;


export type TenantQuery = { __typename?: 'Query', tenant: { __typename?: 'Tenant', id: string, isActive: boolean, name: string, description?: string | null, createdAt: Date | string, updatedAt: Date | string, startDate: Date | string } };

export type UserFromAuthIdQueryVariables = Exact<{
  authId: Scalars['String'];
}>;


export type UserFromAuthIdQuery = { __typename?: 'Query', userFromAuthId: { __typename?: 'User', authId?: string | null, avatar?: string | null, code?: string | null, createdAt: Date | string, email?: string | null, id: string, isActive: boolean, isAdmin: boolean, isManager: boolean, isPaymentManager: boolean, isSetup: boolean, name?: string | null, updatedAt: Date | string, managees?: Array<{ __typename?: 'User', id: string }> | null, manager?: { __typename?: 'User', id: string } | null, tenant?: { __typename?: 'Tenant', id: string } | null } };

export type TimesheetQueryVariables = Exact<{
  date: Scalars['Date'];
  userId: Scalars['String'];
}>;


export type TimesheetQuery = { __typename?: 'Query', timesheetFromDate: { __typename?: 'Timesheet', id: string, status: Status, isChanged: boolean, period: { __typename?: 'Period', id: string, startDate: Date | string, endDate: Date | string }, timesheetFields: Array<{ __typename?: 'TimesheetField', field: { __typename?: 'Field', id: string, name: string } }> } };

export type TimeEntryQueryVariables = Exact<{
  index: Scalars['Int'];
  timeEntryRowId: Scalars['String'];
}>;


export type TimeEntryQuery = { __typename?: 'Query', timeEntry: { __typename?: 'TimeEntry', id: string, createdAt: Date | string, updatedAt: Date | string, date: Date | string, index: number, hours: number, entryComments: Array<{ __typename?: 'EntryComment', id: string }> } };

export type CreateTimeEntryMutationVariables = Exact<{
  index: Scalars['Int'];
  timeEntryRowId: Scalars['String'];
  hours: Scalars['Float'];
  date: Scalars['Date'];
}>;


export type CreateTimeEntryMutation = { __typename?: 'Mutation', createTimeEntry: { __typename?: 'TimeEntry', id: string, createdAt: Date | string, updatedAt: Date | string, date: Date | string, hours: number, index: number, entryComments: Array<{ __typename?: 'EntryComment', id: string }> } };

export type UpdateTimeEntryhoursMutationVariables = Exact<{
  id: Scalars['String'];
  hours: Scalars['Float'];
}>;


export type UpdateTimeEntryhoursMutation = { __typename?: 'Mutation', updateTimeEntry: { __typename?: 'TimeEntry', id: string, createdAt: Date | string, updatedAt: Date | string, date: Date | string, hours: number, index: number, entryComments: Array<{ __typename?: 'EntryComment', id: string }> } };

export type DeleteTimeEntryMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteTimeEntryMutation = { __typename?: 'Mutation', deleteTimeEntry: { __typename?: 'TimeEntry', id: string, hours: number, date: Date | string, index: number, updatedAt: Date | string, createdAt: Date | string } };

export type TimeEntriesQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type TimeEntriesQuery = { __typename?: 'Query', timeEntryRow: { __typename?: 'TimeEntryRow', timeEntries: Array<{ __typename?: 'TimeEntry', id: string }> } };

export type TimeEntryRowFragment = { __typename?: 'TimeEntryRow', id: string, createdAt: Date | string, updatedAt: Date | string, rowOptions: Array<{ __typename?: 'EntryRowOption', id: string, fieldOption: { __typename?: 'FieldOption', id: string } }> };

export type TimeEntryRowQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type TimeEntryRowQuery = { __typename?: 'Query', timeEntryRow: { __typename?: 'TimeEntryRow', id: string, createdAt: Date | string, updatedAt: Date | string, rowOptions: Array<{ __typename?: 'EntryRowOption', id: string, fieldOption: { __typename?: 'FieldOption', id: string } }> } };

export type TimeEntryRowsQueryVariables = Exact<{
  timesheetId: Scalars['String'];
}>;


export type TimeEntryRowsQuery = { __typename?: 'Query', timeEntryRows: Array<{ __typename?: 'TimeEntryRow', id: string, createdAt: Date | string, updatedAt: Date | string, rowOptions: Array<{ __typename?: 'EntryRowOption', id: string, fieldOption: { __typename?: 'FieldOption', id: string } }> }> };

export type CreateTimeEntryRowMutationVariables = Exact<{
  timesheetId: Scalars['String'];
}>;


export type CreateTimeEntryRowMutation = { __typename?: 'Mutation', createTimeEntryRow: { __typename?: 'TimeEntryRow', id: string, createdAt: Date | string, updatedAt: Date | string, rowOptions: Array<{ __typename?: 'EntryRowOption', id: string, fieldOption: { __typename?: 'FieldOption', id: string } }> } };

export type DeleteTimeEntryRowMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteTimeEntryRowMutation = { __typename?: 'Mutation', deleteTimeEntryRow: { __typename?: 'TimeEntryRow', id: string } };

export type UserFromTokenQueryVariables = Exact<{
  token: Scalars['String'];
}>;


export type UserFromTokenQuery = { __typename?: 'Query', userFromToken: { __typename?: 'User', id: string, name?: string | null, tenant?: { __typename?: 'Tenant', name: string, description?: string | null, logo?: string | null, isActive: boolean, updatedAt: Date | string, createdAt: Date | string } | null } };

export type EntryCommentQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type EntryCommentQuery = { __typename?: 'Query', entryComment: { __typename?: 'EntryComment', id: string, createdAt: Date | string, updatedAt: Date | string, text: string, user: { __typename?: 'User', id: string, name?: string | null, avatar?: string | null } } };

export type CreateEntryCommentMutationVariables = Exact<{
  text: Scalars['String'];
  entryId: Scalars['String'];
  userId: Scalars['String'];
}>;


export type CreateEntryCommentMutation = { __typename?: 'Mutation', createEntryComment: { __typename?: 'EntryComment', id: string, createdAt: Date | string, updatedAt: Date | string, text: string, user: { __typename?: 'User', id: string, name?: string | null, avatar?: string | null } } };

export type CreateOneTimeTokenMutationVariables = Exact<{
  userId: Scalars['String'];
  tenantId: Scalars['String'];
}>;


export type CreateOneTimeTokenMutation = { __typename?: 'Mutation', createOneTimeToken: { __typename?: 'OneTimeToken', id: string, createdAt: Date | string, updatedAt: Date | string, user: { __typename?: 'User', id: string }, tenant: { __typename?: 'Tenant', id: string } } };

export type CreateUserMutationVariables = Exact<{
  email: Scalars['String'];
  name: Scalars['String'];
  tenantId?: InputMaybe<Scalars['String']>;
  authId: Scalars['String'];
  code?: InputMaybe<Scalars['String']>;
  avatar?: InputMaybe<Scalars['String']>;
  isActive?: InputMaybe<Scalars['Boolean']>;
  isAdmin?: InputMaybe<Scalars['Boolean']>;
  isPaymentManager?: InputMaybe<Scalars['Boolean']>;
  isManager?: InputMaybe<Scalars['Boolean']>;
  managerId?: InputMaybe<Scalars['String']>;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'User', id: string, email?: string | null, authId?: string | null, isActive: boolean, code?: string | null, isSetup: boolean, isAdmin: boolean, name?: string | null, avatar?: string | null, createdAt: Date | string, updatedAt: Date | string, isPaymentManager: boolean, isManager: boolean, tenant?: { __typename?: 'Tenant', id: string } | null, manager?: { __typename?: 'User', id: string } | null, managees?: Array<{ __typename?: 'User', id: string }> | null } };

export type UpdateUserMutationVariables = Exact<{
  id: Scalars['String'];
  authId?: InputMaybe<Scalars['String']>;
  avatar?: InputMaybe<Scalars['String']>;
  tenantId?: InputMaybe<Scalars['String']>;
  code?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  isActive?: InputMaybe<Scalars['Boolean']>;
  isAdmin?: InputMaybe<Scalars['Boolean']>;
  isManager?: InputMaybe<Scalars['Boolean']>;
  isPaymentManager?: InputMaybe<Scalars['Boolean']>;
  isSetup?: InputMaybe<Scalars['Boolean']>;
  managerId?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'User', updatedAt: Date | string, name?: string | null, isSetup: boolean, isPaymentManager: boolean, isManager: boolean, isAdmin: boolean, isActive: boolean, id: string, email?: string | null, createdAt: Date | string, code?: string | null, avatar?: string | null, authId?: string | null, tenant?: { __typename?: 'Tenant', id: string } | null, manager?: { __typename?: 'User', id: string } | null, managees?: Array<{ __typename?: 'User', id: string }> | null } };

export type ManagersQueryVariables = Exact<{
  tenantId: Scalars['String'];
}>;


export type ManagersQuery = { __typename?: 'Query', managers: Array<{ __typename?: 'User', id: string, name?: string | null }> };

export type OneTimeTokensQueryVariables = Exact<{
  tenantId: Scalars['String'];
}>;


export type OneTimeTokensQuery = { __typename?: 'Query', oneTimeTokens: Array<{ __typename?: 'OneTimeToken', id: string, createdAt: Date | string, user: { __typename?: 'User', id: string, name?: string | null, avatar?: string | null } }> };

export type UsersQueryVariables = Exact<{
  tenantId: Scalars['String'];
}>;


export type UsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: string, email?: string | null, authId?: string | null, code?: string | null, isActive: boolean, isAdmin: boolean, name?: string | null, avatar?: string | null, createdAt: Date | string, updatedAt: Date | string, isPaymentManager: boolean, isManager: boolean, isSetup: boolean, tenant?: { __typename?: 'Tenant', id: string, name: string } | null, managees?: Array<{ __typename?: 'User', id: string, email?: string | null, name?: string | null, avatar?: string | null }> | null, manager?: { __typename?: 'User', id: string, email?: string | null, name?: string | null } | null }> };

export type StatusEventsQueryVariables = Exact<{
  timesheetId: Scalars['String'];
}>;


export type StatusEventsQuery = { __typename?: 'Query', statusEvents: Array<{ __typename?: 'StatusEvent', id: string, createdAt: Date | string, type: EventType, status: Status, message?: string | null, user: { __typename?: 'User', name?: string | null, avatar?: string | null } }> };

export type CreateStatusEventMutationVariables = Exact<{
  timesheetId: Scalars['String'];
  type: EventType;
  status: Status;
  message: Scalars['String'];
  userId: Scalars['String'];
}>;


export type CreateStatusEventMutation = { __typename?: 'Mutation', createStatusEvent: { __typename?: 'StatusEvent', id: string, createdAt: Date | string, type: EventType, status: Status, message?: string | null, user: { __typename?: 'User', name?: string | null, avatar?: string | null } } };

export type TimesheetUpdatedQueryVariables = Exact<{
  timesheetId: Scalars['String'];
}>;


export type TimesheetUpdatedQuery = { __typename?: 'Query', timesheet: { __typename?: 'Timesheet', updatedAt: Date | string, id: string, timeEntryRows: Array<{ __typename?: 'TimeEntryRow', id: string, updatedAt: Date | string, timeEntries: Array<{ __typename?: 'TimeEntry', id: string, updatedAt: Date | string }> }> } };

export type UpdateTimesheetChangedMutationVariables = Exact<{
  timesheetId: Scalars['String'];
  changed: Scalars['Boolean'];
}>;


export type UpdateTimesheetChangedMutation = { __typename?: 'Mutation', updateTimesheet: { __typename?: 'Timesheet', id: string, updatedAt: Date | string, isChanged: boolean } };

export type CreateTenantMutationVariables = Exact<{
  name: Scalars['String'];
  description: Scalars['String'];
  logo: Scalars['String'];
  isActive: Scalars['Boolean'];
  startDate: Scalars['Date'];
  periodLength: Scalars['Int'];
}>;


export type CreateTenantMutation = { __typename?: 'Mutation', createTenant: { __typename?: 'Tenant', id: string, name: string, description?: string | null, startDate: Date | string, periodLength: number, isActive: boolean, updatedAt: Date | string, createdAt: Date | string } };

export type FieldQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type FieldQuery = { __typename?: 'Query', field: { __typename?: 'Field', createdAt: Date | string, updatedAt: Date | string, name: string, isActive: boolean, id: string, fieldType: FieldType, fieldOptions: Array<{ __typename?: 'FieldOption', id: string, name: string, isActive: boolean, updatedAt: Date | string, createdAt: Date | string }> } };

export type EntryRowOptionQueryVariables = Exact<{
  fieldId: Scalars['String'];
  rowId: Scalars['String'];
}>;


export type EntryRowOptionQuery = { __typename?: 'Query', entryRowOption: { __typename?: 'EntryRowOption', createdAt: Date | string, id: string, updatedAt: Date | string, fieldOption: { __typename?: 'FieldOption', createdAt: Date | string, id: string, isActive: boolean, name: string, updatedAt: Date | string } } };

export type UpdateEntryRowOptionMutationVariables = Exact<{
  fieldId: Scalars['String'];
  fieldOptionId: Scalars['String'];
  rowId: Scalars['String'];
}>;


export type UpdateEntryRowOptionMutation = { __typename?: 'Mutation', updateEntryRowOption: { __typename?: 'EntryRowOption', createdAt: Date | string, id: string, updatedAt: Date | string, fieldOption: { __typename?: 'FieldOption', createdAt: Date | string, id: string, isActive: boolean, name: string, updatedAt: Date | string } } };

export const TimeEntryRowFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TimeEntryRow"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TimeEntryRow"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"rowOptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fieldOption"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<TimeEntryRowFragment, unknown>;
export const TenantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Tenant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tenantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tenant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tenantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}}]}}]}}]} as unknown as DocumentNode<TenantQuery, TenantQueryVariables>;
export const UserFromAuthIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserFromAuthId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"authId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userFromAuthId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"authId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"authId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authId"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"isManager"}},{"kind":"Field","name":{"kind":"Name","value":"isPaymentManager"}},{"kind":"Field","name":{"kind":"Name","value":"isSetup"}},{"kind":"Field","name":{"kind":"Name","value":"managees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"manager"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<UserFromAuthIdQuery, UserFromAuthIdQueryVariables>;
export const TimesheetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Timesheet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"date"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Date"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timesheetFromDate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"date"},"value":{"kind":"Variable","name":{"kind":"Name","value":"date"}}},{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isChanged"}},{"kind":"Field","name":{"kind":"Name","value":"period"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"timesheetFields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"field"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<TimesheetQuery, TimesheetQueryVariables>;
export const TimeEntryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TimeEntry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"index"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"timeEntryRowId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timeEntry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"index"},"value":{"kind":"Variable","name":{"kind":"Name","value":"index"}}},{"kind":"Argument","name":{"kind":"Name","value":"timeEntryRowId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timeEntryRowId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"hours"}},{"kind":"Field","name":{"kind":"Name","value":"entryComments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<TimeEntryQuery, TimeEntryQueryVariables>;
export const CreateTimeEntryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTimeEntry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"index"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"timeEntryRowId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hours"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"date"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Date"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTimeEntry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"index"},"value":{"kind":"Variable","name":{"kind":"Name","value":"index"}}},{"kind":"Argument","name":{"kind":"Name","value":"hours"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hours"}}},{"kind":"Argument","name":{"kind":"Name","value":"date"},"value":{"kind":"Variable","name":{"kind":"Name","value":"date"}}},{"kind":"Argument","name":{"kind":"Name","value":"timeEntryRowId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timeEntryRowId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"hours"}},{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"entryComments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CreateTimeEntryMutation, CreateTimeEntryMutationVariables>;
export const UpdateTimeEntryhoursDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTimeEntryhours"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hours"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTimeEntry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"hours"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hours"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"hours"}},{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"entryComments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateTimeEntryhoursMutation, UpdateTimeEntryhoursMutationVariables>;
export const DeleteTimeEntryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteTimeEntry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTimeEntry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"hours"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<DeleteTimeEntryMutation, DeleteTimeEntryMutationVariables>;
export const TimeEntriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TimeEntries"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timeEntryRow"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timeEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<TimeEntriesQuery, TimeEntriesQueryVariables>;
export const TimeEntryRowDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TimeEntryRow"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timeEntryRow"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TimeEntryRow"}}]}}]}},...TimeEntryRowFragmentDoc.definitions]} as unknown as DocumentNode<TimeEntryRowQuery, TimeEntryRowQueryVariables>;
export const TimeEntryRowsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TimeEntryRows"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"timesheetId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timeEntryRows"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"timesheetId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timesheetId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TimeEntryRow"}}]}}]}},...TimeEntryRowFragmentDoc.definitions]} as unknown as DocumentNode<TimeEntryRowsQuery, TimeEntryRowsQueryVariables>;
export const CreateTimeEntryRowDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTimeEntryRow"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"timesheetId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTimeEntryRow"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"timesheetId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timesheetId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TimeEntryRow"}}]}}]}},...TimeEntryRowFragmentDoc.definitions]} as unknown as DocumentNode<CreateTimeEntryRowMutation, CreateTimeEntryRowMutationVariables>;
export const DeleteTimeEntryRowDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteTimeEntryRow"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTimeEntryRow"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteTimeEntryRowMutation, DeleteTimeEntryRowMutationVariables>;
export const UserFromTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserFromToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userFromToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<UserFromTokenQuery, UserFromTokenQueryVariables>;
export const EntryCommentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EntryComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entryComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}}]} as unknown as DocumentNode<EntryCommentQuery, EntryCommentQueryVariables>;
export const CreateEntryCommentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createEntryComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"text"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entryId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createEntryComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"text"},"value":{"kind":"Variable","name":{"kind":"Name","value":"text"}}},{"kind":"Argument","name":{"kind":"Name","value":"entryId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entryId"}}},{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}}]} as unknown as DocumentNode<CreateEntryCommentMutation, CreateEntryCommentMutationVariables>;
export const CreateOneTimeTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateOneTimeToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tenantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createOneTimeToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"tenantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tenantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tenant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateOneTimeTokenMutation, CreateOneTimeTokenMutationVariables>;
export const CreateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tenantId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"authId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"avatar"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isActive"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isAdmin"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isPaymentManager"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isManager"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"managerId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"tenantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tenantId"}}},{"kind":"Argument","name":{"kind":"Name","value":"authId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"authId"}}},{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}},{"kind":"Argument","name":{"kind":"Name","value":"avatar"},"value":{"kind":"Variable","name":{"kind":"Name","value":"avatar"}}},{"kind":"Argument","name":{"kind":"Name","value":"isActive"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isActive"}}},{"kind":"Argument","name":{"kind":"Name","value":"isAdmin"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isAdmin"}}},{"kind":"Argument","name":{"kind":"Name","value":"isPaymentManager"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isPaymentManager"}}},{"kind":"Argument","name":{"kind":"Name","value":"isManager"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isManager"}}},{"kind":"Argument","name":{"kind":"Name","value":"managerId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"managerId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"authId"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"isSetup"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"manager"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isPaymentManager"}},{"kind":"Field","name":{"kind":"Name","value":"isManager"}},{"kind":"Field","name":{"kind":"Name","value":"managees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;
export const UpdateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"authId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"avatar"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tenantId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isActive"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isAdmin"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isManager"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isPaymentManager"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isSetup"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"managerId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"authId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"authId"}}},{"kind":"Argument","name":{"kind":"Name","value":"tenantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tenantId"}}},{"kind":"Argument","name":{"kind":"Name","value":"avatar"},"value":{"kind":"Variable","name":{"kind":"Name","value":"avatar"}}},{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"isActive"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isActive"}}},{"kind":"Argument","name":{"kind":"Name","value":"isAdmin"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isAdmin"}}},{"kind":"Argument","name":{"kind":"Name","value":"isManager"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isManager"}}},{"kind":"Argument","name":{"kind":"Name","value":"isPaymentManager"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isPaymentManager"}}},{"kind":"Argument","name":{"kind":"Name","value":"isSetup"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isSetup"}}},{"kind":"Argument","name":{"kind":"Name","value":"managerId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"managerId"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"manager"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"managees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isSetup"}},{"kind":"Field","name":{"kind":"Name","value":"isPaymentManager"}},{"kind":"Field","name":{"kind":"Name","value":"isManager"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"authId"}}]}}]}}]} as unknown as DocumentNode<UpdateUserMutation, UpdateUserMutationVariables>;
export const ManagersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Managers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tenantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"managers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"tenantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tenantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<ManagersQuery, ManagersQueryVariables>;
export const OneTimeTokensDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OneTimeTokens"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tenantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"oneTimeTokens"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"tenantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tenantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<OneTimeTokensQuery, OneTimeTokensQueryVariables>;
export const UsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Users"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tenantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"tenantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tenantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"authId"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"tenant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"managees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"manager"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isPaymentManager"}},{"kind":"Field","name":{"kind":"Name","value":"isManager"}},{"kind":"Field","name":{"kind":"Name","value":"isSetup"}}]}}]}}]} as unknown as DocumentNode<UsersQuery, UsersQueryVariables>;
export const StatusEventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"StatusEvents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"timesheetId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"statusEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"timesheetId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timesheetId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}}]} as unknown as DocumentNode<StatusEventsQuery, StatusEventsQueryVariables>;
export const CreateStatusEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateStatusEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"timesheetId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EventType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Status"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"message"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createStatusEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"timesheetId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timesheetId"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"message"},"value":{"kind":"Variable","name":{"kind":"Name","value":"message"}}},{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}}]} as unknown as DocumentNode<CreateStatusEventMutation, CreateStatusEventMutationVariables>;
export const TimesheetUpdatedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TimesheetUpdated"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"timesheetId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timesheet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timesheetId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timeEntryRows"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"timeEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]}}]} as unknown as DocumentNode<TimesheetUpdatedQuery, TimesheetUpdatedQueryVariables>;
export const UpdateTimesheetChangedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTimesheetChanged"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"timesheetId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"changed"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTimesheet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timesheetId"}}},{"kind":"Argument","name":{"kind":"Name","value":"isChanged"},"value":{"kind":"Variable","name":{"kind":"Name","value":"changed"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"isChanged"}}]}}]}}]} as unknown as DocumentNode<UpdateTimesheetChangedMutation, UpdateTimesheetChangedMutationVariables>;
export const CreateTenantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTenant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"logo"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isActive"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Date"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"periodLength"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTenant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}},{"kind":"Argument","name":{"kind":"Name","value":"logo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"logo"}}},{"kind":"Argument","name":{"kind":"Name","value":"isActive"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isActive"}}},{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"periodLength"},"value":{"kind":"Variable","name":{"kind":"Name","value":"periodLength"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"periodLength"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<CreateTenantMutation, CreateTenantMutationVariables>;
export const FieldDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Field"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"field"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fieldType"}},{"kind":"Field","name":{"kind":"Name","value":"fieldOptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<FieldQuery, FieldQueryVariables>;
export const EntryRowOptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EntryRowOption"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fieldId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"rowId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entryRowOption"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"fieldId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fieldId"}}},{"kind":"Argument","name":{"kind":"Name","value":"rowId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"rowId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"fieldOption"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<EntryRowOptionQuery, EntryRowOptionQueryVariables>;
export const UpdateEntryRowOptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateEntryRowOption"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fieldId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fieldOptionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"rowId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateEntryRowOption"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"fieldId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fieldId"}}},{"kind":"Argument","name":{"kind":"Name","value":"fieldOptionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fieldOptionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"rowId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"rowId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"fieldOption"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateEntryRowOptionMutation, UpdateEntryRowOptionMutationVariables>;