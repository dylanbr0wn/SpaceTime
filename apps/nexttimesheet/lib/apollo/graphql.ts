import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
};

export type Department = {
  __typename?: 'Department';
  createdAt: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  isActive: Scalars['Boolean'];
  name: Scalars['String'];
  projects: Array<Project>;
  updatedAt: Scalars['DateTime'];
  users: Array<User>;
};

export type EntryComment = {
  __typename?: 'EntryComment';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  text: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  user: User;
};

export type EntryCommentCreateInput = {
  text: Scalars['String'];
  timeEntryId: Scalars['String'];
  userId: Scalars['String'];
};

export type EntryCommentDeleteInput = {
  id: Scalars['ID'];
};

export type EntryCommentUpdateInput = {
  id: Scalars['ID'];
  text: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  attachAuth0Id?: Maybe<User>;
  createEntryComment?: Maybe<EntryComment>;
  createOneTimeToken?: Maybe<OneTimeToken>;
  createTimeEntry?: Maybe<TimeEntry>;
  createTimeEntryRow?: Maybe<TimeEntryRow>;
  createUser?: Maybe<User>;
  deleteEntryComment?: Maybe<EntryComment>;
  deleteTimeEntry?: Maybe<TimeEntry>;
  deleteTimeEntryRow?: Maybe<TimeEntryRow>;
  updateEntryComment?: Maybe<EntryComment>;
  updateTimeEntryRow?: Maybe<TimeEntryRow>;
  updateTimeEntryhours?: Maybe<TimeEntry>;
  updateUser?: Maybe<User>;
};


export type MutationAttachAuth0IdArgs = {
  auth0Id: Scalars['String'];
  userId: Scalars['ID'];
};


export type MutationCreateEntryCommentArgs = {
  entryComment: EntryCommentCreateInput;
};


export type MutationCreateOneTimeTokenArgs = {
  tenantId: Scalars['String'];
  userId: Scalars['String'];
};


export type MutationCreateTimeEntryArgs = {
  data: TimeEntryCreateInput;
};


export type MutationCreateTimeEntryRowArgs = {
  departmentId?: InputMaybe<Scalars['String']>;
  projectId?: InputMaybe<Scalars['String']>;
  timesheetId: Scalars['String'];
  workTypeId?: InputMaybe<Scalars['String']>;
};


export type MutationCreateUserArgs = {
  user: UserCreateInput;
};


export type MutationDeleteEntryCommentArgs = {
  EntryComment: EntryCommentDeleteInput;
};


export type MutationDeleteTimeEntryArgs = {
  id: Scalars['String'];
};


export type MutationDeleteTimeEntryRowArgs = {
  TimeEntryRow: TimeEntryRowDeleteInput;
};


export type MutationUpdateEntryCommentArgs = {
  entryComment: EntryCommentUpdateInput;
};


export type MutationUpdateTimeEntryRowArgs = {
  departmentId?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  projectId?: InputMaybe<Scalars['String']>;
  workTypeId?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateTimeEntryhoursArgs = {
  data: TimeEntryUpdateInput;
  id: Scalars['String'];
};


export type MutationUpdateUserArgs = {
  user: UserUpdateInput;
};

export type OneTimeToken = {
  __typename?: 'OneTimeToken';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  tenant: Tenant;
  updatedAt: Scalars['DateTime'];
  user: User;
};

export type Period = {
  __typename?: 'Period';
  createdAt: Scalars['DateTime'];
  endDate: Scalars['DateTime'];
  id: Scalars['ID'];
  startDate: Scalars['DateTime'];
};

export type Project = {
  __typename?: 'Project';
  code: Scalars['String'];
  createdAt: Scalars['DateTime'];
  department: Department;
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  isActive: Scalars['Boolean'];
  name: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type Query = {
  __typename?: 'Query';
  allUsers: Array<User>;
  departments: Array<Department>;
  getEntryComment?: Maybe<EntryComment>;
  getEntryComments?: Maybe<Array<EntryComment>>;
  getEntryCommentsByTimesheet: Array<EntryComment>;
  getOneTimeToken?: Maybe<OneTimeToken>;
  getOneTimeTokens: Array<OneTimeToken>;
  getTimeEntryRow?: Maybe<TimeEntryRow>;
  getTimeEntryRows: Array<TimeEntryRow>;
  getTimesheet?: Maybe<Timesheet>;
  getUserFromAuth0?: Maybe<User>;
  getUserFromCode?: Maybe<User>;
  getUserFromToken?: Maybe<User>;
  managers: Array<User>;
  projects: Array<Project>;
  tenantFromId?: Maybe<Tenant>;
  timeEntry?: Maybe<TimeEntry>;
  timeEntryFromId?: Maybe<TimeEntry>;
  workTypes: Array<WorkType>;
};


export type QueryGetEntryCommentArgs = {
  commentId: Scalars['String'];
};


export type QueryGetEntryCommentsArgs = {
  timeEntryId: Scalars['String'];
};


export type QueryGetEntryCommentsByTimesheetArgs = {
  timesheetId: Scalars['String'];
};


export type QueryGetOneTimeTokenArgs = {
  id: Scalars['String'];
};


export type QueryGetOneTimeTokensArgs = {
  tenantId: Scalars['String'];
};


export type QueryGetTimeEntryRowArgs = {
  id: Scalars['String'];
};


export type QueryGetTimeEntryRowsArgs = {
  timesheetId: Scalars['String'];
};


export type QueryGetTimesheetArgs = {
  Timesheet: TimesheetGetInput;
};


export type QueryGetUserFromAuth0Args = {
  auth0Id: Scalars['String'];
};


export type QueryGetUserFromCodeArgs = {
  code: Scalars['String'];
  tenantId: Scalars['String'];
};


export type QueryGetUserFromTokenArgs = {
  token: Scalars['ID'];
};


export type QueryManagersArgs = {
  tenantId: Scalars['String'];
};


export type QueryTenantFromIdArgs = {
  tenantId: Scalars['String'];
};


export type QueryTimeEntryArgs = {
  TimeEntry: TimeEntryFromRowDateInput;
};


export type QueryTimeEntryFromIdArgs = {
  TimeEntry: TimeEntryFromIdInput;
};

export type Tenant = {
  __typename?: 'Tenant';
  createdAt: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  isActive: Scalars['Boolean'];
  logo?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  periodLength: Scalars['Int'];
  startDate: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type TimeEntry = {
  __typename?: 'TimeEntry';
  createdAt: Scalars['DateTime'];
  date: Scalars['DateTime'];
  entryComments: Array<EntryComment>;
  hours: Scalars['Float'];
  id: Scalars['ID'];
  updatedAt: Scalars['DateTime'];
};

export type TimeEntryCreateInput = {
  date: Scalars['DateTime'];
  hours: Scalars['Float'];
  timeEntryRowId: Scalars['String'];
};

export type TimeEntryFromIdInput = {
  id: Scalars['ID'];
};

export type TimeEntryFromRowDateInput = {
  date: Scalars['DateTime'];
  timeEntryRowId: Scalars['String'];
};

export type TimeEntryRow = {
  __typename?: 'TimeEntryRow';
  createdAt: Scalars['DateTime'];
  department?: Maybe<Department>;
  id: Scalars['ID'];
  project?: Maybe<Project>;
  timeEntries: Array<TimeEntry>;
  updatedAt: Scalars['DateTime'];
  workType?: Maybe<WorkType>;
};

export type TimeEntryRowDeleteInput = {
  id: Scalars['ID'];
};

export type TimeEntryRowUpdateInput = {
  departmentId?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  projectId?: InputMaybe<Scalars['String']>;
  workTypeId?: InputMaybe<Scalars['String']>;
};

export type TimeEntryUpdateInput = {
  hours: Scalars['Float'];
};

export type Timesheet = {
  __typename?: 'Timesheet';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  period: Period;
  timeEntryRows: Array<TimeEntryRow>;
  updatedAt: Scalars['DateTime'];
  user: User;
};

export type TimesheetGetInput = {
  date: Scalars['DateTime'];
  userId: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  auth0Id?: Maybe<Scalars['String']>;
  avatar?: Maybe<Scalars['String']>;
  code: Scalars['String'];
  createdAt: Scalars['DateTime'];
  department: Department;
  email: Scalars['String'];
  id: Scalars['ID'];
  isActive: Scalars['Boolean'];
  isAdmin: Scalars['Boolean'];
  isManager: Scalars['Boolean'];
  isPaymentManager: Scalars['Boolean'];
  managees: Array<User>;
  manager?: Maybe<User>;
  name?: Maybe<Scalars['String']>;
  tenant: Tenant;
  updatedAt: Scalars['DateTime'];
};

/** User Create Input */
export type UserCreateInput = {
  auth0Id: Scalars['String'];
  avatar?: InputMaybe<Scalars['String']>;
  code: Scalars['String'];
  departmentId: Scalars['String'];
  email: Scalars['String'];
  isActive: Scalars['Boolean'];
  isAdmin: Scalars['Boolean'];
  isManager: Scalars['Boolean'];
  isPaymentManager: Scalars['Boolean'];
  managerId: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
  tenantId: Scalars['String'];
};

/** User Update Input */
export type UserUpdateInput = {
  auth0Id: Scalars['String'];
  code: Scalars['String'];
  departmentId: Scalars['String'];
  email: Scalars['String'];
  id: Scalars['ID'];
  isActive: Scalars['Boolean'];
  isAdmin: Scalars['Boolean'];
  isManager: Scalars['Boolean'];
  isPaymentManager: Scalars['Boolean'];
  managerId: Scalars['String'];
};

export type WorkType = {
  __typename?: 'WorkType';
  code: Scalars['String'];
  createdAt: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  isActive: Scalars['Boolean'];
  isBillable: Scalars['Boolean'];
  isDefault: Scalars['Boolean'];
  isSystem: Scalars['Boolean'];
  multiplier: Scalars['Float'];
  name: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type TenantFromIdQueryVariables = Exact<{
  tenantId: Scalars['String'];
}>;


export type TenantFromIdQuery = { __typename?: 'Query', tenantFromId?: { __typename?: 'Tenant', id: string, isActive: boolean, name: string, description?: string | null } | null };

export type GetUserFromAuth0QueryVariables = Exact<{
  auth0Id: Scalars['String'];
}>;


export type GetUserFromAuth0Query = { __typename?: 'Query', getUserFromAuth0?: { __typename?: 'User', id: string, email: string, auth0Id?: string | null, code: string, isActive: boolean, isAdmin: boolean, createdAt: any, updatedAt: any, isPaymentManager: boolean, isManager: boolean, department: { __typename?: 'Department', id: string }, managees: Array<{ __typename?: 'User', id: string }>, manager?: { __typename?: 'User', id: string } | null, tenant: { __typename?: 'Tenant', id: string } } | null };

export type GetTimesheetQueryVariables = Exact<{
  timesheet: TimesheetGetInput;
}>;


export type GetTimesheetQuery = { __typename?: 'Query', getTimesheet?: { __typename?: 'Timesheet', id: string, period: { __typename?: 'Period', id: string, startDate: any, endDate: any } } | null };

export type DepartmentsQueryVariables = Exact<{ [key: string]: never; }>;


export type DepartmentsQuery = { __typename?: 'Query', departments: Array<{ __typename?: 'Department', id: string, name: string, createdAt: any, updatedAt: any, isActive: boolean, description?: string | null }> };

export type ProjectsQueryVariables = Exact<{ [key: string]: never; }>;


export type ProjectsQuery = { __typename?: 'Query', projects: Array<{ __typename?: 'Project', id: string, name: string, createdAt: any, updatedAt: any, isActive: boolean, description?: string | null, code: string, department: { __typename?: 'Department', id: string } }> };

export type WorkTypesQueryVariables = Exact<{ [key: string]: never; }>;


export type WorkTypesQuery = { __typename?: 'Query', workTypes: Array<{ __typename?: 'WorkType', id: string, name: string, createdAt: any, updatedAt: any, isActive: boolean, description?: string | null, code: string, isSystem: boolean, isDefault: boolean, multiplier: number, isBillable: boolean }> };

export type TimeEntryQueryVariables = Exact<{
  timeEntry: TimeEntryFromRowDateInput;
}>;


export type TimeEntryQuery = { __typename?: 'Query', timeEntry?: { __typename?: 'TimeEntry', id: string, createdAt: any, updatedAt: any, date: any, hours: number, entryComments: Array<{ __typename?: 'EntryComment', id: string, createdAt: any, updatedAt: any, text: string, user: { __typename?: 'User', id: string } }> } | null };

export type TimeEntryFromIdQueryVariables = Exact<{
  timeEntry: TimeEntryFromIdInput;
}>;


export type TimeEntryFromIdQuery = { __typename?: 'Query', timeEntryFromId?: { __typename?: 'TimeEntry', id: string, createdAt: any, updatedAt: any, date: any, hours: number, entryComments: Array<{ __typename?: 'EntryComment', id: string }> } | null };

export type CreateTimeEntryMutationVariables = Exact<{
  data: TimeEntryCreateInput;
}>;


export type CreateTimeEntryMutation = { __typename?: 'Mutation', createTimeEntry?: { __typename?: 'TimeEntry', id: string, createdAt: any, updatedAt: any, date: any, hours: number, entryComments: Array<{ __typename?: 'EntryComment', id: string }> } | null };

export type UpdateTimeEntryhoursMutationVariables = Exact<{
  updateTimeEntryhoursId: Scalars['String'];
  data: TimeEntryUpdateInput;
}>;


export type UpdateTimeEntryhoursMutation = { __typename?: 'Mutation', updateTimeEntryhours?: { __typename?: 'TimeEntry', id: string, createdAt: any, updatedAt: any, date: any, hours: number, entryComments: Array<{ __typename?: 'EntryComment', id: string }> } | null };

export type DeleteTimeEntryMutationVariables = Exact<{
  deleteTimeEntryId: Scalars['String'];
}>;


export type DeleteTimeEntryMutation = { __typename?: 'Mutation', deleteTimeEntry?: { __typename?: 'TimeEntry', id: string, hours: number, date: any, updatedAt: any, createdAt: any } | null };

export type UpdateTimeEntryRowMutationVariables = Exact<{
  updateTimeEntryRowId: Scalars['String'];
  departmentId?: InputMaybe<Scalars['String']>;
  projectId?: InputMaybe<Scalars['String']>;
  workTypeId?: InputMaybe<Scalars['String']>;
}>;


export type UpdateTimeEntryRowMutation = { __typename?: 'Mutation', updateTimeEntryRow?: { __typename?: 'TimeEntryRow', id: string, createdAt: any, updatedAt: any, workType?: { __typename?: 'WorkType', id: string } | null, project?: { __typename?: 'Project', id: string } | null, department?: { __typename?: 'Department', id: string } | null } | null };

export type GetTimeEntryRowQueryVariables = Exact<{
  getTimeEntryRowId: Scalars['String'];
}>;


export type GetTimeEntryRowQuery = { __typename?: 'Query', getTimeEntryRow?: { __typename?: 'TimeEntryRow', id: string, createdAt: any, updatedAt: any, workType?: { __typename?: 'WorkType', id: string } | null, project?: { __typename?: 'Project', id: string } | null, department?: { __typename?: 'Department', id: string } | null, timeEntries: Array<{ __typename?: 'TimeEntry', id: string, createdAt: any, updatedAt: any, date: any, hours: number, entryComments: Array<{ __typename?: 'EntryComment', id: string }> }> } | null };

export type GetTimeEntryRowsQueryVariables = Exact<{
  timesheetId: Scalars['String'];
}>;


export type GetTimeEntryRowsQuery = { __typename?: 'Query', getTimeEntryRows: Array<{ __typename?: 'TimeEntryRow', id: string, createdAt: any, updatedAt: any, workType?: { __typename?: 'WorkType', id: string } | null, project?: { __typename?: 'Project', id: string } | null, department?: { __typename?: 'Department', id: string } | null, timeEntries: Array<{ __typename?: 'TimeEntry', id: string, createdAt: any, updatedAt: any, date: any, hours: number, entryComments: Array<{ __typename?: 'EntryComment', id: string }> }> }> };

export type CreateTimeEntryRowMutationVariables = Exact<{
  timesheetId: Scalars['String'];
}>;


export type CreateTimeEntryRowMutation = { __typename?: 'Mutation', createTimeEntryRow?: { __typename?: 'TimeEntryRow', id: string, createdAt: any, updatedAt: any, workType?: { __typename?: 'WorkType', id: string } | null, project?: { __typename?: 'Project', id: string } | null, department?: { __typename?: 'Department', id: string } | null, timeEntries: Array<{ __typename?: 'TimeEntry', id: string, createdAt: any, updatedAt: any, date: any, hours: number, entryComments: Array<{ __typename?: 'EntryComment', id: string }> }> } | null };

export type DeleteTimeEntryRowMutationVariables = Exact<{
  timeEntryRow: TimeEntryRowDeleteInput;
}>;


export type DeleteTimeEntryRowMutation = { __typename?: 'Mutation', deleteTimeEntryRow?: { __typename?: 'TimeEntryRow', id: string } | null };

export type GetUserFromTokenQueryVariables = Exact<{
  token: Scalars['ID'];
}>;


export type GetUserFromTokenQuery = { __typename?: 'Query', getUserFromToken?: { __typename?: 'User', id: string, tenant: { __typename?: 'Tenant', name: string, description?: string | null, logo?: string | null, isActive: boolean, updatedAt: any, createdAt: any } } | null };

export type AttachAuth0IdMutationVariables = Exact<{
  auth0Id: Scalars['String'];
  userId: Scalars['ID'];
}>;


export type AttachAuth0IdMutation = { __typename?: 'Mutation', attachAuth0Id?: { __typename?: 'User', id: string, email: string, auth0Id?: string | null, code: string, isActive: boolean, isAdmin: boolean, createdAt: any, updatedAt: any, isPaymentManager: boolean, isManager: boolean, department: { __typename?: 'Department', id: string }, tenant: { __typename?: 'Tenant', id: string }, managees: Array<{ __typename?: 'User', id: string }>, manager?: { __typename?: 'User', id: string } | null } | null };

export type GetEntryCommentQueryVariables = Exact<{
  commentId: Scalars['String'];
}>;


export type GetEntryCommentQuery = { __typename?: 'Query', getEntryComment?: { __typename?: 'EntryComment', id: string, createdAt: any, updatedAt: any, text: string, user: { __typename?: 'User', id: string, name?: string | null, avatar?: string | null } } | null };

export type CreateEntryCommentMutationVariables = Exact<{
  entryComment: EntryCommentCreateInput;
}>;


export type CreateEntryCommentMutation = { __typename?: 'Mutation', createEntryComment?: { __typename?: 'EntryComment', id: string, createdAt: any, updatedAt: any, text: string, user: { __typename?: 'User', id: string, name?: string | null, avatar?: string | null } } | null };

export type CreateOneTimeTokenMutationVariables = Exact<{
  userId: Scalars['String'];
  tenantId: Scalars['String'];
}>;


export type CreateOneTimeTokenMutation = { __typename?: 'Mutation', createOneTimeToken?: { __typename?: 'OneTimeToken', id: string, createdAt: any, updatedAt: any, user: { __typename?: 'User', id: string }, tenant: { __typename?: 'Tenant', id: string } } | null };

export type CreateUserMutationVariables = Exact<{
  user: UserCreateInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser?: { __typename?: 'User', id: string, email: string, auth0Id?: string | null, isActive: boolean, code: string, isAdmin: boolean, name?: string | null, avatar?: string | null, createdAt: any, updatedAt: any, isPaymentManager: boolean, isManager: boolean, tenant: { __typename?: 'Tenant', id: string }, department: { __typename?: 'Department', id: string }, manager?: { __typename?: 'User', id: string } | null, managees: Array<{ __typename?: 'User', id: string }> } | null };

export type ManagersQueryVariables = Exact<{
  tenantId: Scalars['String'];
}>;


export type ManagersQuery = { __typename?: 'Query', managers: Array<{ __typename?: 'User', id: string, name?: string | null }> };

export type GetUserFromCodeQueryVariables = Exact<{
  code: Scalars['String'];
  tenantId: Scalars['String'];
}>;


export type GetUserFromCodeQuery = { __typename?: 'Query', getUserFromCode?: { __typename?: 'User', id: string } | null };

export type GetOneTimeTokensQueryVariables = Exact<{
  tenantId: Scalars['String'];
}>;


export type GetOneTimeTokensQuery = { __typename?: 'Query', getOneTimeTokens: Array<{ __typename?: 'OneTimeToken', id: string, createdAt: any, user: { __typename?: 'User', id: string, name?: string | null, avatar?: string | null } }> };


export const TenantFromIdDocument = gql`
    query TenantFromId($tenantId: String!) {
  tenantFromId(tenantId: $tenantId) {
    id
    isActive
    name
    description
  }
}
    `;

/**
 * __useTenantFromIdQuery__
 *
 * To run a query within a React component, call `useTenantFromIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useTenantFromIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTenantFromIdQuery({
 *   variables: {
 *      tenantId: // value for 'tenantId'
 *   },
 * });
 */
export function useTenantFromIdQuery(baseOptions: Apollo.QueryHookOptions<TenantFromIdQuery, TenantFromIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TenantFromIdQuery, TenantFromIdQueryVariables>(TenantFromIdDocument, options);
      }
export function useTenantFromIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TenantFromIdQuery, TenantFromIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TenantFromIdQuery, TenantFromIdQueryVariables>(TenantFromIdDocument, options);
        }
export type TenantFromIdQueryHookResult = ReturnType<typeof useTenantFromIdQuery>;
export type TenantFromIdLazyQueryHookResult = ReturnType<typeof useTenantFromIdLazyQuery>;
export type TenantFromIdQueryResult = Apollo.QueryResult<TenantFromIdQuery, TenantFromIdQueryVariables>;
export const GetUserFromAuth0Document = gql`
    query GetUserFromAuth0($auth0Id: String!) {
  getUserFromAuth0(auth0Id: $auth0Id) {
    id
    email
    auth0Id
    code
    isActive
    isAdmin
    createdAt
    updatedAt
    department {
      id
    }
    managees {
      id
    }
    manager {
      id
    }
    isPaymentManager
    isManager
    tenant {
      id
    }
  }
}
    `;

/**
 * __useGetUserFromAuth0Query__
 *
 * To run a query within a React component, call `useGetUserFromAuth0Query` and pass it any options that fit your needs.
 * When your component renders, `useGetUserFromAuth0Query` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserFromAuth0Query({
 *   variables: {
 *      auth0Id: // value for 'auth0Id'
 *   },
 * });
 */
export function useGetUserFromAuth0Query(baseOptions: Apollo.QueryHookOptions<GetUserFromAuth0Query, GetUserFromAuth0QueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserFromAuth0Query, GetUserFromAuth0QueryVariables>(GetUserFromAuth0Document, options);
      }
export function useGetUserFromAuth0LazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserFromAuth0Query, GetUserFromAuth0QueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserFromAuth0Query, GetUserFromAuth0QueryVariables>(GetUserFromAuth0Document, options);
        }
export type GetUserFromAuth0QueryHookResult = ReturnType<typeof useGetUserFromAuth0Query>;
export type GetUserFromAuth0LazyQueryHookResult = ReturnType<typeof useGetUserFromAuth0LazyQuery>;
export type GetUserFromAuth0QueryResult = Apollo.QueryResult<GetUserFromAuth0Query, GetUserFromAuth0QueryVariables>;
export const GetTimesheetDocument = gql`
    query GetTimesheet($timesheet: TimesheetGetInput!) {
  getTimesheet(Timesheet: $timesheet) {
    id
    period {
      id
      startDate
      endDate
    }
  }
}
    `;

/**
 * __useGetTimesheetQuery__
 *
 * To run a query within a React component, call `useGetTimesheetQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTimesheetQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTimesheetQuery({
 *   variables: {
 *      timesheet: // value for 'timesheet'
 *   },
 * });
 */
export function useGetTimesheetQuery(baseOptions: Apollo.QueryHookOptions<GetTimesheetQuery, GetTimesheetQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTimesheetQuery, GetTimesheetQueryVariables>(GetTimesheetDocument, options);
      }
export function useGetTimesheetLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTimesheetQuery, GetTimesheetQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTimesheetQuery, GetTimesheetQueryVariables>(GetTimesheetDocument, options);
        }
export type GetTimesheetQueryHookResult = ReturnType<typeof useGetTimesheetQuery>;
export type GetTimesheetLazyQueryHookResult = ReturnType<typeof useGetTimesheetLazyQuery>;
export type GetTimesheetQueryResult = Apollo.QueryResult<GetTimesheetQuery, GetTimesheetQueryVariables>;
export const DepartmentsDocument = gql`
    query Departments {
  departments {
    id
    name
    createdAt
    updatedAt
    isActive
    description
  }
}
    `;

/**
 * __useDepartmentsQuery__
 *
 * To run a query within a React component, call `useDepartmentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useDepartmentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDepartmentsQuery({
 *   variables: {
 *   },
 * });
 */
export function useDepartmentsQuery(baseOptions?: Apollo.QueryHookOptions<DepartmentsQuery, DepartmentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DepartmentsQuery, DepartmentsQueryVariables>(DepartmentsDocument, options);
      }
export function useDepartmentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DepartmentsQuery, DepartmentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DepartmentsQuery, DepartmentsQueryVariables>(DepartmentsDocument, options);
        }
export type DepartmentsQueryHookResult = ReturnType<typeof useDepartmentsQuery>;
export type DepartmentsLazyQueryHookResult = ReturnType<typeof useDepartmentsLazyQuery>;
export type DepartmentsQueryResult = Apollo.QueryResult<DepartmentsQuery, DepartmentsQueryVariables>;
export const ProjectsDocument = gql`
    query Projects {
  projects {
    id
    name
    createdAt
    updatedAt
    isActive
    description
    code
    department {
      id
    }
  }
}
    `;

/**
 * __useProjectsQuery__
 *
 * To run a query within a React component, call `useProjectsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProjectsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProjectsQuery({
 *   variables: {
 *   },
 * });
 */
export function useProjectsQuery(baseOptions?: Apollo.QueryHookOptions<ProjectsQuery, ProjectsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProjectsQuery, ProjectsQueryVariables>(ProjectsDocument, options);
      }
export function useProjectsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProjectsQuery, ProjectsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProjectsQuery, ProjectsQueryVariables>(ProjectsDocument, options);
        }
export type ProjectsQueryHookResult = ReturnType<typeof useProjectsQuery>;
export type ProjectsLazyQueryHookResult = ReturnType<typeof useProjectsLazyQuery>;
export type ProjectsQueryResult = Apollo.QueryResult<ProjectsQuery, ProjectsQueryVariables>;
export const WorkTypesDocument = gql`
    query WorkTypes {
  workTypes {
    id
    name
    createdAt
    updatedAt
    isActive
    description
    code
    isSystem
    isDefault
    multiplier
    isBillable
  }
}
    `;

/**
 * __useWorkTypesQuery__
 *
 * To run a query within a React component, call `useWorkTypesQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkTypesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkTypesQuery({
 *   variables: {
 *   },
 * });
 */
export function useWorkTypesQuery(baseOptions?: Apollo.QueryHookOptions<WorkTypesQuery, WorkTypesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WorkTypesQuery, WorkTypesQueryVariables>(WorkTypesDocument, options);
      }
export function useWorkTypesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WorkTypesQuery, WorkTypesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WorkTypesQuery, WorkTypesQueryVariables>(WorkTypesDocument, options);
        }
export type WorkTypesQueryHookResult = ReturnType<typeof useWorkTypesQuery>;
export type WorkTypesLazyQueryHookResult = ReturnType<typeof useWorkTypesLazyQuery>;
export type WorkTypesQueryResult = Apollo.QueryResult<WorkTypesQuery, WorkTypesQueryVariables>;
export const TimeEntryDocument = gql`
    query TimeEntry($timeEntry: TimeEntryFromRowDateInput!) {
  timeEntry(TimeEntry: $timeEntry) {
    id
    createdAt
    updatedAt
    date
    hours
    entryComments {
      id
      createdAt
      updatedAt
      text
      user {
        id
      }
    }
  }
}
    `;

/**
 * __useTimeEntryQuery__
 *
 * To run a query within a React component, call `useTimeEntryQuery` and pass it any options that fit your needs.
 * When your component renders, `useTimeEntryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTimeEntryQuery({
 *   variables: {
 *      timeEntry: // value for 'timeEntry'
 *   },
 * });
 */
export function useTimeEntryQuery(baseOptions: Apollo.QueryHookOptions<TimeEntryQuery, TimeEntryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TimeEntryQuery, TimeEntryQueryVariables>(TimeEntryDocument, options);
      }
export function useTimeEntryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TimeEntryQuery, TimeEntryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TimeEntryQuery, TimeEntryQueryVariables>(TimeEntryDocument, options);
        }
export type TimeEntryQueryHookResult = ReturnType<typeof useTimeEntryQuery>;
export type TimeEntryLazyQueryHookResult = ReturnType<typeof useTimeEntryLazyQuery>;
export type TimeEntryQueryResult = Apollo.QueryResult<TimeEntryQuery, TimeEntryQueryVariables>;
export const TimeEntryFromIdDocument = gql`
    query TimeEntryFromId($timeEntry: TimeEntryFromIdInput!) {
  timeEntryFromId(TimeEntry: $timeEntry) {
    id
    createdAt
    updatedAt
    date
    hours
    entryComments {
      id
    }
  }
}
    `;

/**
 * __useTimeEntryFromIdQuery__
 *
 * To run a query within a React component, call `useTimeEntryFromIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useTimeEntryFromIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTimeEntryFromIdQuery({
 *   variables: {
 *      timeEntry: // value for 'timeEntry'
 *   },
 * });
 */
export function useTimeEntryFromIdQuery(baseOptions: Apollo.QueryHookOptions<TimeEntryFromIdQuery, TimeEntryFromIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TimeEntryFromIdQuery, TimeEntryFromIdQueryVariables>(TimeEntryFromIdDocument, options);
      }
export function useTimeEntryFromIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TimeEntryFromIdQuery, TimeEntryFromIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TimeEntryFromIdQuery, TimeEntryFromIdQueryVariables>(TimeEntryFromIdDocument, options);
        }
export type TimeEntryFromIdQueryHookResult = ReturnType<typeof useTimeEntryFromIdQuery>;
export type TimeEntryFromIdLazyQueryHookResult = ReturnType<typeof useTimeEntryFromIdLazyQuery>;
export type TimeEntryFromIdQueryResult = Apollo.QueryResult<TimeEntryFromIdQuery, TimeEntryFromIdQueryVariables>;
export const CreateTimeEntryDocument = gql`
    mutation CreateTimeEntry($data: TimeEntryCreateInput!) {
  createTimeEntry(data: $data) {
    id
    createdAt
    updatedAt
    date
    hours
    entryComments {
      id
    }
  }
}
    `;
export type CreateTimeEntryMutationFn = Apollo.MutationFunction<CreateTimeEntryMutation, CreateTimeEntryMutationVariables>;

/**
 * __useCreateTimeEntryMutation__
 *
 * To run a mutation, you first call `useCreateTimeEntryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTimeEntryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTimeEntryMutation, { data, loading, error }] = useCreateTimeEntryMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateTimeEntryMutation(baseOptions?: Apollo.MutationHookOptions<CreateTimeEntryMutation, CreateTimeEntryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTimeEntryMutation, CreateTimeEntryMutationVariables>(CreateTimeEntryDocument, options);
      }
export type CreateTimeEntryMutationHookResult = ReturnType<typeof useCreateTimeEntryMutation>;
export type CreateTimeEntryMutationResult = Apollo.MutationResult<CreateTimeEntryMutation>;
export type CreateTimeEntryMutationOptions = Apollo.BaseMutationOptions<CreateTimeEntryMutation, CreateTimeEntryMutationVariables>;
export const UpdateTimeEntryhoursDocument = gql`
    mutation UpdateTimeEntryhours($updateTimeEntryhoursId: String!, $data: TimeEntryUpdateInput!) {
  updateTimeEntryhours(id: $updateTimeEntryhoursId, data: $data) {
    id
    createdAt
    updatedAt
    date
    hours
    entryComments {
      id
    }
  }
}
    `;
export type UpdateTimeEntryhoursMutationFn = Apollo.MutationFunction<UpdateTimeEntryhoursMutation, UpdateTimeEntryhoursMutationVariables>;

/**
 * __useUpdateTimeEntryhoursMutation__
 *
 * To run a mutation, you first call `useUpdateTimeEntryhoursMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTimeEntryhoursMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTimeEntryhoursMutation, { data, loading, error }] = useUpdateTimeEntryhoursMutation({
 *   variables: {
 *      updateTimeEntryhoursId: // value for 'updateTimeEntryhoursId'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateTimeEntryhoursMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTimeEntryhoursMutation, UpdateTimeEntryhoursMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTimeEntryhoursMutation, UpdateTimeEntryhoursMutationVariables>(UpdateTimeEntryhoursDocument, options);
      }
export type UpdateTimeEntryhoursMutationHookResult = ReturnType<typeof useUpdateTimeEntryhoursMutation>;
export type UpdateTimeEntryhoursMutationResult = Apollo.MutationResult<UpdateTimeEntryhoursMutation>;
export type UpdateTimeEntryhoursMutationOptions = Apollo.BaseMutationOptions<UpdateTimeEntryhoursMutation, UpdateTimeEntryhoursMutationVariables>;
export const DeleteTimeEntryDocument = gql`
    mutation DeleteTimeEntry($deleteTimeEntryId: String!) {
  deleteTimeEntry(id: $deleteTimeEntryId) {
    id
    hours
    date
    updatedAt
    createdAt
  }
}
    `;
export type DeleteTimeEntryMutationFn = Apollo.MutationFunction<DeleteTimeEntryMutation, DeleteTimeEntryMutationVariables>;

/**
 * __useDeleteTimeEntryMutation__
 *
 * To run a mutation, you first call `useDeleteTimeEntryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTimeEntryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTimeEntryMutation, { data, loading, error }] = useDeleteTimeEntryMutation({
 *   variables: {
 *      deleteTimeEntryId: // value for 'deleteTimeEntryId'
 *   },
 * });
 */
export function useDeleteTimeEntryMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTimeEntryMutation, DeleteTimeEntryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTimeEntryMutation, DeleteTimeEntryMutationVariables>(DeleteTimeEntryDocument, options);
      }
export type DeleteTimeEntryMutationHookResult = ReturnType<typeof useDeleteTimeEntryMutation>;
export type DeleteTimeEntryMutationResult = Apollo.MutationResult<DeleteTimeEntryMutation>;
export type DeleteTimeEntryMutationOptions = Apollo.BaseMutationOptions<DeleteTimeEntryMutation, DeleteTimeEntryMutationVariables>;
export const UpdateTimeEntryRowDocument = gql`
    mutation UpdateTimeEntryRow($updateTimeEntryRowId: String!, $departmentId: String, $projectId: String, $workTypeId: String) {
  updateTimeEntryRow(
    id: $updateTimeEntryRowId
    departmentId: $departmentId
    projectId: $projectId
    workTypeId: $workTypeId
  ) {
    id
    createdAt
    updatedAt
    workType {
      id
    }
    project {
      id
    }
    department {
      id
    }
  }
}
    `;
export type UpdateTimeEntryRowMutationFn = Apollo.MutationFunction<UpdateTimeEntryRowMutation, UpdateTimeEntryRowMutationVariables>;

/**
 * __useUpdateTimeEntryRowMutation__
 *
 * To run a mutation, you first call `useUpdateTimeEntryRowMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTimeEntryRowMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTimeEntryRowMutation, { data, loading, error }] = useUpdateTimeEntryRowMutation({
 *   variables: {
 *      updateTimeEntryRowId: // value for 'updateTimeEntryRowId'
 *      departmentId: // value for 'departmentId'
 *      projectId: // value for 'projectId'
 *      workTypeId: // value for 'workTypeId'
 *   },
 * });
 */
export function useUpdateTimeEntryRowMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTimeEntryRowMutation, UpdateTimeEntryRowMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTimeEntryRowMutation, UpdateTimeEntryRowMutationVariables>(UpdateTimeEntryRowDocument, options);
      }
export type UpdateTimeEntryRowMutationHookResult = ReturnType<typeof useUpdateTimeEntryRowMutation>;
export type UpdateTimeEntryRowMutationResult = Apollo.MutationResult<UpdateTimeEntryRowMutation>;
export type UpdateTimeEntryRowMutationOptions = Apollo.BaseMutationOptions<UpdateTimeEntryRowMutation, UpdateTimeEntryRowMutationVariables>;
export const GetTimeEntryRowDocument = gql`
    query GetTimeEntryRow($getTimeEntryRowId: String!) {
  getTimeEntryRow(id: $getTimeEntryRowId) {
    id
    createdAt
    updatedAt
    workType {
      id
    }
    project {
      id
    }
    department {
      id
    }
    timeEntries {
      id
      createdAt
      updatedAt
      date
      hours
      entryComments {
        id
      }
    }
  }
}
    `;

/**
 * __useGetTimeEntryRowQuery__
 *
 * To run a query within a React component, call `useGetTimeEntryRowQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTimeEntryRowQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTimeEntryRowQuery({
 *   variables: {
 *      getTimeEntryRowId: // value for 'getTimeEntryRowId'
 *   },
 * });
 */
export function useGetTimeEntryRowQuery(baseOptions: Apollo.QueryHookOptions<GetTimeEntryRowQuery, GetTimeEntryRowQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTimeEntryRowQuery, GetTimeEntryRowQueryVariables>(GetTimeEntryRowDocument, options);
      }
export function useGetTimeEntryRowLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTimeEntryRowQuery, GetTimeEntryRowQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTimeEntryRowQuery, GetTimeEntryRowQueryVariables>(GetTimeEntryRowDocument, options);
        }
export type GetTimeEntryRowQueryHookResult = ReturnType<typeof useGetTimeEntryRowQuery>;
export type GetTimeEntryRowLazyQueryHookResult = ReturnType<typeof useGetTimeEntryRowLazyQuery>;
export type GetTimeEntryRowQueryResult = Apollo.QueryResult<GetTimeEntryRowQuery, GetTimeEntryRowQueryVariables>;
export const GetTimeEntryRowsDocument = gql`
    query GetTimeEntryRows($timesheetId: String!) {
  getTimeEntryRows(timesheetId: $timesheetId) {
    id
    createdAt
    updatedAt
    workType {
      id
    }
    project {
      id
    }
    department {
      id
    }
    timeEntries {
      id
      createdAt
      updatedAt
      date
      hours
      entryComments {
        id
      }
    }
  }
}
    `;

/**
 * __useGetTimeEntryRowsQuery__
 *
 * To run a query within a React component, call `useGetTimeEntryRowsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTimeEntryRowsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTimeEntryRowsQuery({
 *   variables: {
 *      timesheetId: // value for 'timesheetId'
 *   },
 * });
 */
export function useGetTimeEntryRowsQuery(baseOptions: Apollo.QueryHookOptions<GetTimeEntryRowsQuery, GetTimeEntryRowsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTimeEntryRowsQuery, GetTimeEntryRowsQueryVariables>(GetTimeEntryRowsDocument, options);
      }
export function useGetTimeEntryRowsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTimeEntryRowsQuery, GetTimeEntryRowsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTimeEntryRowsQuery, GetTimeEntryRowsQueryVariables>(GetTimeEntryRowsDocument, options);
        }
export type GetTimeEntryRowsQueryHookResult = ReturnType<typeof useGetTimeEntryRowsQuery>;
export type GetTimeEntryRowsLazyQueryHookResult = ReturnType<typeof useGetTimeEntryRowsLazyQuery>;
export type GetTimeEntryRowsQueryResult = Apollo.QueryResult<GetTimeEntryRowsQuery, GetTimeEntryRowsQueryVariables>;
export const CreateTimeEntryRowDocument = gql`
    mutation CreateTimeEntryRow($timesheetId: String!) {
  createTimeEntryRow(timesheetId: $timesheetId) {
    id
    createdAt
    updatedAt
    workType {
      id
    }
    project {
      id
    }
    department {
      id
    }
    timeEntries {
      id
      createdAt
      updatedAt
      date
      hours
      entryComments {
        id
      }
    }
  }
}
    `;
export type CreateTimeEntryRowMutationFn = Apollo.MutationFunction<CreateTimeEntryRowMutation, CreateTimeEntryRowMutationVariables>;

/**
 * __useCreateTimeEntryRowMutation__
 *
 * To run a mutation, you first call `useCreateTimeEntryRowMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTimeEntryRowMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTimeEntryRowMutation, { data, loading, error }] = useCreateTimeEntryRowMutation({
 *   variables: {
 *      timesheetId: // value for 'timesheetId'
 *   },
 * });
 */
export function useCreateTimeEntryRowMutation(baseOptions?: Apollo.MutationHookOptions<CreateTimeEntryRowMutation, CreateTimeEntryRowMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTimeEntryRowMutation, CreateTimeEntryRowMutationVariables>(CreateTimeEntryRowDocument, options);
      }
export type CreateTimeEntryRowMutationHookResult = ReturnType<typeof useCreateTimeEntryRowMutation>;
export type CreateTimeEntryRowMutationResult = Apollo.MutationResult<CreateTimeEntryRowMutation>;
export type CreateTimeEntryRowMutationOptions = Apollo.BaseMutationOptions<CreateTimeEntryRowMutation, CreateTimeEntryRowMutationVariables>;
export const DeleteTimeEntryRowDocument = gql`
    mutation DeleteTimeEntryRow($timeEntryRow: TimeEntryRowDeleteInput!) {
  deleteTimeEntryRow(TimeEntryRow: $timeEntryRow) {
    id
  }
}
    `;
export type DeleteTimeEntryRowMutationFn = Apollo.MutationFunction<DeleteTimeEntryRowMutation, DeleteTimeEntryRowMutationVariables>;

/**
 * __useDeleteTimeEntryRowMutation__
 *
 * To run a mutation, you first call `useDeleteTimeEntryRowMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTimeEntryRowMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTimeEntryRowMutation, { data, loading, error }] = useDeleteTimeEntryRowMutation({
 *   variables: {
 *      timeEntryRow: // value for 'timeEntryRow'
 *   },
 * });
 */
export function useDeleteTimeEntryRowMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTimeEntryRowMutation, DeleteTimeEntryRowMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTimeEntryRowMutation, DeleteTimeEntryRowMutationVariables>(DeleteTimeEntryRowDocument, options);
      }
export type DeleteTimeEntryRowMutationHookResult = ReturnType<typeof useDeleteTimeEntryRowMutation>;
export type DeleteTimeEntryRowMutationResult = Apollo.MutationResult<DeleteTimeEntryRowMutation>;
export type DeleteTimeEntryRowMutationOptions = Apollo.BaseMutationOptions<DeleteTimeEntryRowMutation, DeleteTimeEntryRowMutationVariables>;
export const GetUserFromTokenDocument = gql`
    query getUserFromToken($token: ID!) {
  getUserFromToken(token: $token) {
    id
    tenant {
      name
      description
      logo
      isActive
      updatedAt
      createdAt
    }
  }
}
    `;

/**
 * __useGetUserFromTokenQuery__
 *
 * To run a query within a React component, call `useGetUserFromTokenQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserFromTokenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserFromTokenQuery({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useGetUserFromTokenQuery(baseOptions: Apollo.QueryHookOptions<GetUserFromTokenQuery, GetUserFromTokenQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserFromTokenQuery, GetUserFromTokenQueryVariables>(GetUserFromTokenDocument, options);
      }
export function useGetUserFromTokenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserFromTokenQuery, GetUserFromTokenQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserFromTokenQuery, GetUserFromTokenQueryVariables>(GetUserFromTokenDocument, options);
        }
export type GetUserFromTokenQueryHookResult = ReturnType<typeof useGetUserFromTokenQuery>;
export type GetUserFromTokenLazyQueryHookResult = ReturnType<typeof useGetUserFromTokenLazyQuery>;
export type GetUserFromTokenQueryResult = Apollo.QueryResult<GetUserFromTokenQuery, GetUserFromTokenQueryVariables>;
export const AttachAuth0IdDocument = gql`
    mutation AttachAuth0Id($auth0Id: String!, $userId: ID!) {
  attachAuth0Id(auth0Id: $auth0Id, userId: $userId) {
    id
    email
    auth0Id
    code
    isActive
    isAdmin
    createdAt
    updatedAt
    department {
      id
    }
    tenant {
      id
    }
    managees {
      id
    }
    manager {
      id
    }
    isPaymentManager
    isManager
  }
}
    `;
export type AttachAuth0IdMutationFn = Apollo.MutationFunction<AttachAuth0IdMutation, AttachAuth0IdMutationVariables>;

/**
 * __useAttachAuth0IdMutation__
 *
 * To run a mutation, you first call `useAttachAuth0IdMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAttachAuth0IdMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [attachAuth0IdMutation, { data, loading, error }] = useAttachAuth0IdMutation({
 *   variables: {
 *      auth0Id: // value for 'auth0Id'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useAttachAuth0IdMutation(baseOptions?: Apollo.MutationHookOptions<AttachAuth0IdMutation, AttachAuth0IdMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AttachAuth0IdMutation, AttachAuth0IdMutationVariables>(AttachAuth0IdDocument, options);
      }
export type AttachAuth0IdMutationHookResult = ReturnType<typeof useAttachAuth0IdMutation>;
export type AttachAuth0IdMutationResult = Apollo.MutationResult<AttachAuth0IdMutation>;
export type AttachAuth0IdMutationOptions = Apollo.BaseMutationOptions<AttachAuth0IdMutation, AttachAuth0IdMutationVariables>;
export const GetEntryCommentDocument = gql`
    query GetEntryComment($commentId: String!) {
  getEntryComment(commentId: $commentId) {
    id
    createdAt
    updatedAt
    text
    user {
      id
      name
      avatar
    }
  }
}
    `;

/**
 * __useGetEntryCommentQuery__
 *
 * To run a query within a React component, call `useGetEntryCommentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEntryCommentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEntryCommentQuery({
 *   variables: {
 *      commentId: // value for 'commentId'
 *   },
 * });
 */
export function useGetEntryCommentQuery(baseOptions: Apollo.QueryHookOptions<GetEntryCommentQuery, GetEntryCommentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetEntryCommentQuery, GetEntryCommentQueryVariables>(GetEntryCommentDocument, options);
      }
export function useGetEntryCommentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetEntryCommentQuery, GetEntryCommentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetEntryCommentQuery, GetEntryCommentQueryVariables>(GetEntryCommentDocument, options);
        }
export type GetEntryCommentQueryHookResult = ReturnType<typeof useGetEntryCommentQuery>;
export type GetEntryCommentLazyQueryHookResult = ReturnType<typeof useGetEntryCommentLazyQuery>;
export type GetEntryCommentQueryResult = Apollo.QueryResult<GetEntryCommentQuery, GetEntryCommentQueryVariables>;
export const CreateEntryCommentDocument = gql`
    mutation createEntryComment($entryComment: EntryCommentCreateInput!) {
  createEntryComment(entryComment: $entryComment) {
    id
    createdAt
    updatedAt
    text
    user {
      id
      name
      avatar
    }
  }
}
    `;
export type CreateEntryCommentMutationFn = Apollo.MutationFunction<CreateEntryCommentMutation, CreateEntryCommentMutationVariables>;

/**
 * __useCreateEntryCommentMutation__
 *
 * To run a mutation, you first call `useCreateEntryCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateEntryCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createEntryCommentMutation, { data, loading, error }] = useCreateEntryCommentMutation({
 *   variables: {
 *      entryComment: // value for 'entryComment'
 *   },
 * });
 */
export function useCreateEntryCommentMutation(baseOptions?: Apollo.MutationHookOptions<CreateEntryCommentMutation, CreateEntryCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateEntryCommentMutation, CreateEntryCommentMutationVariables>(CreateEntryCommentDocument, options);
      }
export type CreateEntryCommentMutationHookResult = ReturnType<typeof useCreateEntryCommentMutation>;
export type CreateEntryCommentMutationResult = Apollo.MutationResult<CreateEntryCommentMutation>;
export type CreateEntryCommentMutationOptions = Apollo.BaseMutationOptions<CreateEntryCommentMutation, CreateEntryCommentMutationVariables>;
export const CreateOneTimeTokenDocument = gql`
    mutation CreateOneTimeToken($userId: String!, $tenantId: String!) {
  createOneTimeToken(userId: $userId, tenantId: $tenantId) {
    id
    user {
      id
    }
    tenant {
      id
    }
    createdAt
    updatedAt
  }
}
    `;
export type CreateOneTimeTokenMutationFn = Apollo.MutationFunction<CreateOneTimeTokenMutation, CreateOneTimeTokenMutationVariables>;

/**
 * __useCreateOneTimeTokenMutation__
 *
 * To run a mutation, you first call `useCreateOneTimeTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateOneTimeTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createOneTimeTokenMutation, { data, loading, error }] = useCreateOneTimeTokenMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      tenantId: // value for 'tenantId'
 *   },
 * });
 */
export function useCreateOneTimeTokenMutation(baseOptions?: Apollo.MutationHookOptions<CreateOneTimeTokenMutation, CreateOneTimeTokenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateOneTimeTokenMutation, CreateOneTimeTokenMutationVariables>(CreateOneTimeTokenDocument, options);
      }
export type CreateOneTimeTokenMutationHookResult = ReturnType<typeof useCreateOneTimeTokenMutation>;
export type CreateOneTimeTokenMutationResult = Apollo.MutationResult<CreateOneTimeTokenMutation>;
export type CreateOneTimeTokenMutationOptions = Apollo.BaseMutationOptions<CreateOneTimeTokenMutation, CreateOneTimeTokenMutationVariables>;
export const CreateUserDocument = gql`
    mutation CreateUser($user: UserCreateInput!) {
  createUser(user: $user) {
    id
    email
    auth0Id
    isActive
    code
    isAdmin
    tenant {
      id
    }
    name
    avatar
    createdAt
    updatedAt
    department {
      id
    }
    manager {
      id
    }
    isPaymentManager
    isManager
    managees {
      id
    }
  }
}
    `;
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      user: // value for 'user'
 *   },
 * });
 */
export function useCreateUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const ManagersDocument = gql`
    query Managers($tenantId: String!) {
  managers(tenantId: $tenantId) {
    id
    name
  }
}
    `;

/**
 * __useManagersQuery__
 *
 * To run a query within a React component, call `useManagersQuery` and pass it any options that fit your needs.
 * When your component renders, `useManagersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useManagersQuery({
 *   variables: {
 *      tenantId: // value for 'tenantId'
 *   },
 * });
 */
export function useManagersQuery(baseOptions: Apollo.QueryHookOptions<ManagersQuery, ManagersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ManagersQuery, ManagersQueryVariables>(ManagersDocument, options);
      }
export function useManagersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ManagersQuery, ManagersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ManagersQuery, ManagersQueryVariables>(ManagersDocument, options);
        }
export type ManagersQueryHookResult = ReturnType<typeof useManagersQuery>;
export type ManagersLazyQueryHookResult = ReturnType<typeof useManagersLazyQuery>;
export type ManagersQueryResult = Apollo.QueryResult<ManagersQuery, ManagersQueryVariables>;
export const GetUserFromCodeDocument = gql`
    query GetUserFromCode($code: String!, $tenantId: String!) {
  getUserFromCode(code: $code, tenantId: $tenantId) {
    id
  }
}
    `;

/**
 * __useGetUserFromCodeQuery__
 *
 * To run a query within a React component, call `useGetUserFromCodeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserFromCodeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserFromCodeQuery({
 *   variables: {
 *      code: // value for 'code'
 *      tenantId: // value for 'tenantId'
 *   },
 * });
 */
export function useGetUserFromCodeQuery(baseOptions: Apollo.QueryHookOptions<GetUserFromCodeQuery, GetUserFromCodeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserFromCodeQuery, GetUserFromCodeQueryVariables>(GetUserFromCodeDocument, options);
      }
export function useGetUserFromCodeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserFromCodeQuery, GetUserFromCodeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserFromCodeQuery, GetUserFromCodeQueryVariables>(GetUserFromCodeDocument, options);
        }
export type GetUserFromCodeQueryHookResult = ReturnType<typeof useGetUserFromCodeQuery>;
export type GetUserFromCodeLazyQueryHookResult = ReturnType<typeof useGetUserFromCodeLazyQuery>;
export type GetUserFromCodeQueryResult = Apollo.QueryResult<GetUserFromCodeQuery, GetUserFromCodeQueryVariables>;
export const GetOneTimeTokensDocument = gql`
    query GetOneTimeTokens($tenantId: String!) {
  getOneTimeTokens(tenantId: $tenantId) {
    id
    user {
      id
      name
      avatar
    }
    createdAt
  }
}
    `;

/**
 * __useGetOneTimeTokensQuery__
 *
 * To run a query within a React component, call `useGetOneTimeTokensQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOneTimeTokensQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOneTimeTokensQuery({
 *   variables: {
 *      tenantId: // value for 'tenantId'
 *   },
 * });
 */
export function useGetOneTimeTokensQuery(baseOptions: Apollo.QueryHookOptions<GetOneTimeTokensQuery, GetOneTimeTokensQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetOneTimeTokensQuery, GetOneTimeTokensQueryVariables>(GetOneTimeTokensDocument, options);
      }
export function useGetOneTimeTokensLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOneTimeTokensQuery, GetOneTimeTokensQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetOneTimeTokensQuery, GetOneTimeTokensQueryVariables>(GetOneTimeTokensDocument, options);
        }
export type GetOneTimeTokensQueryHookResult = ReturnType<typeof useGetOneTimeTokensQuery>;
export type GetOneTimeTokensLazyQueryHookResult = ReturnType<typeof useGetOneTimeTokensLazyQuery>;
export type GetOneTimeTokensQueryResult = Apollo.QueryResult<GetOneTimeTokensQuery, GetOneTimeTokensQueryVariables>;