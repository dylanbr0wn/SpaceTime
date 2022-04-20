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

export type ApplicationPreferences = {
  __typename?: 'ApplicationPreferences';
  createdAt: Scalars['DateTime'];
  id: Scalars['Int'];
  isActive: Scalars['Boolean'];
  periodLength: Scalars['Int'];
  startDate: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type Department = {
  __typename?: 'Department';
  createdAt: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  isActive: Scalars['Boolean'];
  name: Scalars['String'];
  projects: Array<Project>;
  updatedAt: Scalars['DateTime'];
  users: Array<User>;
};

export type EntryComment = {
  __typename?: 'EntryComment';
  createdAt: Scalars['DateTime'];
  id: Scalars['Int'];
  text: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  user: User;
};

export type EntryCommentCreateInput = {
  text: Scalars['String'];
  timeEntryId: Scalars['Int'];
  userId: Scalars['Int'];
};

export type EntryCommentDeleteInput = {
  id: Scalars['Int'];
};

export type EntryCommentUpdateInput = {
  id: Scalars['Int'];
  text: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createEntryComment?: Maybe<EntryComment>;
  createTimeEntry?: Maybe<TimeEntry>;
  createTimeEntryRow?: Maybe<TimeEntryRow>;
  createUser?: Maybe<User>;
  deleteEntryComment?: Maybe<EntryComment>;
  deleteTimeEntry?: Maybe<TimeEntry>;
  deleteTimeEntryRow?: Maybe<TimeEntryRow>;
  getorCreateTimesheet?: Maybe<Timesheet>;
  updateEntryComment?: Maybe<EntryComment>;
  updateTimeEntryRow?: Maybe<TimeEntryRow>;
  updateTimeEntryhours?: Maybe<TimeEntry>;
  updateUser?: Maybe<User>;
};


export type MutationCreateEntryCommentArgs = {
  entryComment: EntryCommentCreateInput;
};


export type MutationCreateTimeEntryArgs = {
  data: TimeEntryCreateInput;
};


export type MutationCreateTimeEntryRowArgs = {
  departmentId?: InputMaybe<Scalars['Int']>;
  projectId?: InputMaybe<Scalars['Int']>;
  timesheetId: Scalars['Int'];
  workTypeId?: InputMaybe<Scalars['Int']>;
};


export type MutationCreateUserArgs = {
  user: UserCreateInput;
};


export type MutationDeleteEntryCommentArgs = {
  EntryComment: EntryCommentDeleteInput;
};


export type MutationDeleteTimeEntryArgs = {
  id: Scalars['Int'];
};


export type MutationDeleteTimeEntryRowArgs = {
  TimeEntryRow: TimeEntryRowDeleteInput;
};


export type MutationGetorCreateTimesheetArgs = {
  Timesheet: TimesheetGetInput;
};


export type MutationUpdateEntryCommentArgs = {
  entryComment: EntryCommentUpdateInput;
};


export type MutationUpdateTimeEntryRowArgs = {
  departmentId?: InputMaybe<Scalars['Int']>;
  id: Scalars['Int'];
  projectId?: InputMaybe<Scalars['Int']>;
  workTypeId?: InputMaybe<Scalars['Int']>;
};


export type MutationUpdateTimeEntryhoursArgs = {
  data: TimeEntryUpdateInput;
  id: Scalars['Int'];
};


export type MutationUpdateUserArgs = {
  user: UserUpdateInput;
};

export type Period = {
  __typename?: 'Period';
  createdAt: Scalars['DateTime'];
  endDate: Scalars['DateTime'];
  id: Scalars['Int'];
  startDate: Scalars['DateTime'];
};

export type Profile = {
  __typename?: 'Profile';
  avatar?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  firstName: Scalars['String'];
  id: Scalars['Int'];
  lastName: Scalars['String'];
};

export type Project = {
  __typename?: 'Project';
  code: Scalars['String'];
  createdAt: Scalars['DateTime'];
  department: Department;
  description?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  isActive: Scalars['Boolean'];
  name: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type Query = {
  __typename?: 'Query';
  allUsers: Array<User>;
  applicationPreferences?: Maybe<ApplicationPreferences>;
  departments: Array<Department>;
  getEntryComments: Array<EntryComment>;
  getEntryCommentsByTimesheet: Array<EntryComment>;
  getTimeEntryRow?: Maybe<TimeEntryRow>;
  getTimeEntryRows: Array<TimeEntryRow>;
  getUserFromEmail?: Maybe<User>;
  getUserFromId?: Maybe<User>;
  projects: Array<Project>;
  timeEntry?: Maybe<TimeEntry>;
  timeEntryFromId?: Maybe<TimeEntry>;
  workTypes: Array<WorkType>;
};


export type QueryGetEntryCommentsArgs = {
  timeEntryId: Scalars['Int'];
};


export type QueryGetEntryCommentsByTimesheetArgs = {
  timesheetId: Scalars['Int'];
};


export type QueryGetTimeEntryRowArgs = {
  id: Scalars['Int'];
};


export type QueryGetTimeEntryRowsArgs = {
  timesheetId: Scalars['Int'];
};


export type QueryGetUserFromEmailArgs = {
  email: Scalars['String'];
};


export type QueryGetUserFromIdArgs = {
  id: Scalars['Int'];
};


export type QueryTimeEntryArgs = {
  TimeEntry: TimeEntryFromRowDateInput;
};


export type QueryTimeEntryFromIdArgs = {
  TimeEntry: TimeEntryFromIdInput;
};

export type TimeEntry = {
  __typename?: 'TimeEntry';
  createdAt: Scalars['DateTime'];
  date: Scalars['DateTime'];
  entryComments: Array<EntryComment>;
  hours: Scalars['Float'];
  id: Scalars['Int'];
  updatedAt: Scalars['DateTime'];
};

export type TimeEntryCreateInput = {
  date: Scalars['DateTime'];
  hours: Scalars['Float'];
  timeEntryRowId: Scalars['Int'];
};

export type TimeEntryFromIdInput = {
  id: Scalars['Int'];
};

export type TimeEntryFromRowDateInput = {
  date: Scalars['DateTime'];
  timeEntryRowId: Scalars['Int'];
};

export type TimeEntryRow = {
  __typename?: 'TimeEntryRow';
  createdAt: Scalars['DateTime'];
  department?: Maybe<Department>;
  id: Scalars['Int'];
  project?: Maybe<Project>;
  timeEntries: Array<TimeEntry>;
  updatedAt: Scalars['DateTime'];
  workType?: Maybe<WorkType>;
};

export type TimeEntryRowDeleteInput = {
  id: Scalars['Int'];
};

export type TimeEntryRowUpdateInput = {
  departmentId?: InputMaybe<Scalars['Int']>;
  id: Scalars['Int'];
  projectId?: InputMaybe<Scalars['Int']>;
  workTypeId?: InputMaybe<Scalars['Int']>;
};

export type TimeEntryUpdateInput = {
  hours: Scalars['Float'];
};

export type Timesheet = {
  __typename?: 'Timesheet';
  createdAt: Scalars['DateTime'];
  id: Scalars['Int'];
  period: Period;
  timeEntryRows: Array<TimeEntryRow>;
  updatedAt: Scalars['DateTime'];
  user: User;
};

export type TimesheetGetInput = {
  date: Scalars['DateTime'];
  userId: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  code: Scalars['String'];
  createdAt: Scalars['DateTime'];
  department: Department;
  email: Scalars['String'];
  id: Scalars['Int'];
  isActive: Scalars['Boolean'];
  isAdmin: Scalars['Boolean'];
  isManager: Scalars['Boolean'];
  isPaymentManager: Scalars['Boolean'];
  managees: Array<User>;
  manager?: Maybe<User>;
  profile?: Maybe<Profile>;
  updatedAt: Scalars['DateTime'];
};

/** User Create Input */
export type UserCreateInput = {
  avatar?: InputMaybe<Scalars['String']>;
  bio?: InputMaybe<Scalars['String']>;
  code: Scalars['String'];
  departmentId: Scalars['Int'];
  email: Scalars['String'];
  firstName: Scalars['String'];
  isActive: Scalars['Boolean'];
  isAdmin: Scalars['Boolean'];
  isManager: Scalars['Boolean'];
  isPaymentManager: Scalars['Boolean'];
  lastName: Scalars['String'];
  managerId: Scalars['Int'];
};

/** User Update Input */
export type UserUpdateInput = {
  avatar?: InputMaybe<Scalars['String']>;
  bio?: InputMaybe<Scalars['String']>;
  code: Scalars['String'];
  departmentId: Scalars['Int'];
  email: Scalars['String'];
  firstName: Scalars['String'];
  id: Scalars['Int'];
  isActive: Scalars['Boolean'];
  isAdmin: Scalars['Boolean'];
  isManager: Scalars['Boolean'];
  isPaymentManager: Scalars['Boolean'];
  lastName: Scalars['String'];
  managerId: Scalars['Int'];
};

export type WorkType = {
  __typename?: 'WorkType';
  code: Scalars['String'];
  createdAt: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  isActive: Scalars['Boolean'];
  isBillable: Scalars['Boolean'];
  isDefault: Scalars['Boolean'];
  isSystem: Scalars['Boolean'];
  multiplier: Scalars['Float'];
  name: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type InitDataQueryVariables = Exact<{
  email: Scalars['String'];
}>;


export type InitDataQuery = { __typename?: 'Query', getUserFromEmail?: { __typename?: 'User', id: number, email: string, code: string, isActive: boolean, isAdmin: boolean, createdAt: any, updatedAt: any, isPaymentManager: boolean, isManager: boolean, profile?: { __typename?: 'Profile', id: number, lastName: string, firstName: string, avatar?: string | null, bio?: string | null } | null, department: { __typename?: 'Department', id: number }, manager?: { __typename?: 'User', id: number } | null } | null, applicationPreferences?: { __typename?: 'ApplicationPreferences', id: number, createdAt: any, updatedAt: any, isActive: boolean, startDate: any, periodLength: number } | null, projects: Array<{ __typename?: 'Project', id: number, name: string, createdAt: any, updatedAt: any, isActive: boolean, description?: string | null, code: string }>, departments: Array<{ __typename?: 'Department', id: number, name: string, createdAt: any, updatedAt: any, isActive: boolean, description?: string | null }>, workTypes: Array<{ __typename?: 'WorkType', id: number, name: string, createdAt: any, updatedAt: any, isActive: boolean, description?: string | null, code: string, isSystem: boolean, isDefault: boolean, multiplier: number, isBillable: boolean }> };

export type GetUserFromEmailQueryVariables = Exact<{
  email: Scalars['String'];
}>;


export type GetUserFromEmailQuery = { __typename?: 'Query', getUserFromEmail?: { __typename?: 'User', id: number, email: string, code: string, isActive: boolean, isAdmin: boolean, createdAt: any, updatedAt: any, isPaymentManager: boolean, isManager: boolean, profile?: { __typename?: 'Profile', id: number, lastName: string, firstName: string, avatar?: string | null, bio?: string | null } | null, manager?: { __typename?: 'User', id: number } | null, managees: Array<{ __typename?: 'User', id: number }>, department: { __typename?: 'Department', id: number } } | null };

export type GetorCreateTimesheetMutationVariables = Exact<{
  timesheet: TimesheetGetInput;
}>;


export type GetorCreateTimesheetMutation = { __typename?: 'Mutation', getorCreateTimesheet?: { __typename?: 'Timesheet', id: number, period: { __typename?: 'Period', id: number, startDate: any, endDate: any } } | null };

export type DepartmentsQueryVariables = Exact<{ [key: string]: never; }>;


export type DepartmentsQuery = { __typename?: 'Query', departments: Array<{ __typename?: 'Department', id: number, name: string, createdAt: any, updatedAt: any, isActive: boolean, description?: string | null }> };

export type ProjectsQueryVariables = Exact<{ [key: string]: never; }>;


export type ProjectsQuery = { __typename?: 'Query', projects: Array<{ __typename?: 'Project', id: number, name: string, createdAt: any, updatedAt: any, isActive: boolean, description?: string | null, code: string, department: { __typename?: 'Department', id: number } }> };

export type WorkTypesQueryVariables = Exact<{ [key: string]: never; }>;


export type WorkTypesQuery = { __typename?: 'Query', workTypes: Array<{ __typename?: 'WorkType', id: number, name: string, createdAt: any, updatedAt: any, isActive: boolean, description?: string | null, code: string, isSystem: boolean, isDefault: boolean, multiplier: number, isBillable: boolean }> };

export type TimeEntryQueryVariables = Exact<{
  timeEntry: TimeEntryFromRowDateInput;
}>;


export type TimeEntryQuery = { __typename?: 'Query', timeEntry?: { __typename?: 'TimeEntry', id: number, createdAt: any, updatedAt: any, date: any, hours: number, entryComments: Array<{ __typename?: 'EntryComment', id: number, createdAt: any, updatedAt: any, text: string, user: { __typename?: 'User', id: number } }> } | null };

export type GetUserFromIdQueryVariables = Exact<{
  getUserFromIdId: Scalars['Int'];
}>;


export type GetUserFromIdQuery = { __typename?: 'Query', getUserFromId?: { __typename?: 'User', profile?: { __typename?: 'Profile', lastName: string, firstName: string, avatar?: string | null } | null } | null };

export type TimeEntryFromIdQueryVariables = Exact<{
  timeEntry: TimeEntryFromIdInput;
}>;


export type TimeEntryFromIdQuery = { __typename?: 'Query', timeEntryFromId?: { __typename?: 'TimeEntry', id: number, createdAt: any, updatedAt: any, date: any, hours: number, entryComments: Array<{ __typename?: 'EntryComment', id: number }> } | null };

export type CreateEntryCommentMutationVariables = Exact<{
  data: TimeEntryCreateInput;
}>;


export type CreateEntryCommentMutation = { __typename?: 'Mutation', createTimeEntry?: { __typename?: 'TimeEntry', id: number, createdAt: any, updatedAt: any, date: any, hours: number, entryComments: Array<{ __typename?: 'EntryComment', id: number }> } | null };

export type UpdateTimeEntryhoursMutationVariables = Exact<{
  updateTimeEntryhoursId: Scalars['Int'];
  data: TimeEntryUpdateInput;
}>;


export type UpdateTimeEntryhoursMutation = { __typename?: 'Mutation', updateTimeEntryhours?: { __typename?: 'TimeEntry', id: number, createdAt: any, updatedAt: any, date: any, hours: number, entryComments: Array<{ __typename?: 'EntryComment', id: number }> } | null };

export type DeleteTimeEntryMutationVariables = Exact<{
  deleteTimeEntryId: Scalars['Int'];
}>;


export type DeleteTimeEntryMutation = { __typename?: 'Mutation', deleteTimeEntry?: { __typename?: 'TimeEntry', id: number, hours: number, date: any, updatedAt: any, createdAt: any } | null };

export type UpdateTimeEntryRowMutationVariables = Exact<{
  updateTimeEntryRowId: Scalars['Int'];
  departmentId?: InputMaybe<Scalars['Int']>;
  projectId?: InputMaybe<Scalars['Int']>;
  workTypeId?: InputMaybe<Scalars['Int']>;
}>;


export type UpdateTimeEntryRowMutation = { __typename?: 'Mutation', updateTimeEntryRow?: { __typename?: 'TimeEntryRow', id: number, createdAt: any, updatedAt: any, workType?: { __typename?: 'WorkType', id: number } | null, project?: { __typename?: 'Project', id: number } | null, department?: { __typename?: 'Department', id: number } | null } | null };

export type GetTimeEntryRowQueryVariables = Exact<{
  getTimeEntryRowId: Scalars['Int'];
}>;


export type GetTimeEntryRowQuery = { __typename?: 'Query', getTimeEntryRow?: { __typename?: 'TimeEntryRow', id: number, updatedAt: any, createdAt: any, workType?: { __typename?: 'WorkType', id: number, name: string, createdAt: any, updatedAt: any, isActive: boolean, description?: string | null, code: string, isSystem: boolean, isDefault: boolean, multiplier: number, isBillable: boolean } | null, project?: { __typename?: 'Project', id: number, name: string, createdAt: any, updatedAt: any, isActive: boolean, description?: string | null, code: string } | null, department?: { __typename?: 'Department', id: number, name: string, createdAt: any, updatedAt: any, isActive: boolean, description?: string | null, projects: Array<{ __typename?: 'Project', id: number }> } | null } | null };

export type GetTimeEntryRowsQueryVariables = Exact<{
  timesheetId: Scalars['Int'];
}>;


export type GetTimeEntryRowsQuery = { __typename?: 'Query', getTimeEntryRows: Array<{ __typename?: 'TimeEntryRow', id: number, createdAt: any, updatedAt: any, workType?: { __typename?: 'WorkType', id: number } | null, project?: { __typename?: 'Project', id: number } | null, department?: { __typename?: 'Department', id: number } | null, timeEntries: Array<{ __typename?: 'TimeEntry', id: number, createdAt: any, updatedAt: any, date: any, hours: number, entryComments: Array<{ __typename?: 'EntryComment', id: number }> }> }> };

export type CreateTimeEntryRowMutationVariables = Exact<{
  timesheetId: Scalars['Int'];
}>;


export type CreateTimeEntryRowMutation = { __typename?: 'Mutation', createTimeEntryRow?: { __typename?: 'TimeEntryRow', id: number, createdAt: any, updatedAt: any, workType?: { __typename?: 'WorkType', id: number } | null, project?: { __typename?: 'Project', id: number } | null, department?: { __typename?: 'Department', id: number } | null, timeEntries: Array<{ __typename?: 'TimeEntry', id: number, createdAt: any, updatedAt: any, date: any, hours: number, entryComments: Array<{ __typename?: 'EntryComment', id: number }> }> } | null };


export const InitDataDocument = gql`
    query InitData($email: String!) {
  getUserFromEmail(email: $email) {
    id
    email
    code
    isActive
    isAdmin
    profile {
      id
      lastName
      firstName
      avatar
      bio
    }
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
  }
  applicationPreferences {
    id
    createdAt
    updatedAt
    isActive
    startDate
    periodLength
  }
  projects {
    id
    name
    createdAt
    updatedAt
    isActive
    description
    code
  }
  departments {
    id
    name
    createdAt
    updatedAt
    isActive
    description
  }
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
 * __useInitDataQuery__
 *
 * To run a query within a React component, call `useInitDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useInitDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useInitDataQuery({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useInitDataQuery(baseOptions: Apollo.QueryHookOptions<InitDataQuery, InitDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<InitDataQuery, InitDataQueryVariables>(InitDataDocument, options);
      }
export function useInitDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InitDataQuery, InitDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<InitDataQuery, InitDataQueryVariables>(InitDataDocument, options);
        }
export type InitDataQueryHookResult = ReturnType<typeof useInitDataQuery>;
export type InitDataLazyQueryHookResult = ReturnType<typeof useInitDataLazyQuery>;
export type InitDataQueryResult = Apollo.QueryResult<InitDataQuery, InitDataQueryVariables>;
export const GetUserFromEmailDocument = gql`
    query GetUserFromEmail($email: String!) {
  getUserFromEmail(email: $email) {
    id
    email
    code
    isActive
    isAdmin
    profile {
      id
      lastName
      firstName
      avatar
      bio
    }
    createdAt
    updatedAt
    isPaymentManager
    isManager
    manager {
      id
    }
    managees {
      id
    }
    department {
      id
    }
  }
}
    `;

/**
 * __useGetUserFromEmailQuery__
 *
 * To run a query within a React component, call `useGetUserFromEmailQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserFromEmailQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserFromEmailQuery({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useGetUserFromEmailQuery(baseOptions: Apollo.QueryHookOptions<GetUserFromEmailQuery, GetUserFromEmailQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserFromEmailQuery, GetUserFromEmailQueryVariables>(GetUserFromEmailDocument, options);
      }
export function useGetUserFromEmailLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserFromEmailQuery, GetUserFromEmailQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserFromEmailQuery, GetUserFromEmailQueryVariables>(GetUserFromEmailDocument, options);
        }
export type GetUserFromEmailQueryHookResult = ReturnType<typeof useGetUserFromEmailQuery>;
export type GetUserFromEmailLazyQueryHookResult = ReturnType<typeof useGetUserFromEmailLazyQuery>;
export type GetUserFromEmailQueryResult = Apollo.QueryResult<GetUserFromEmailQuery, GetUserFromEmailQueryVariables>;
export const GetorCreateTimesheetDocument = gql`
    mutation GetorCreateTimesheet($timesheet: TimesheetGetInput!) {
  getorCreateTimesheet(Timesheet: $timesheet) {
    id
    period {
      id
      startDate
      endDate
    }
  }
}
    `;
export type GetorCreateTimesheetMutationFn = Apollo.MutationFunction<GetorCreateTimesheetMutation, GetorCreateTimesheetMutationVariables>;

/**
 * __useGetorCreateTimesheetMutation__
 *
 * To run a mutation, you first call `useGetorCreateTimesheetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGetorCreateTimesheetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [getorCreateTimesheetMutation, { data, loading, error }] = useGetorCreateTimesheetMutation({
 *   variables: {
 *      timesheet: // value for 'timesheet'
 *   },
 * });
 */
export function useGetorCreateTimesheetMutation(baseOptions?: Apollo.MutationHookOptions<GetorCreateTimesheetMutation, GetorCreateTimesheetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GetorCreateTimesheetMutation, GetorCreateTimesheetMutationVariables>(GetorCreateTimesheetDocument, options);
      }
export type GetorCreateTimesheetMutationHookResult = ReturnType<typeof useGetorCreateTimesheetMutation>;
export type GetorCreateTimesheetMutationResult = Apollo.MutationResult<GetorCreateTimesheetMutation>;
export type GetorCreateTimesheetMutationOptions = Apollo.BaseMutationOptions<GetorCreateTimesheetMutation, GetorCreateTimesheetMutationVariables>;
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
export const GetUserFromIdDocument = gql`
    query GetUserFromId($getUserFromIdId: Int!) {
  getUserFromId(id: $getUserFromIdId) {
    profile {
      lastName
      firstName
      avatar
    }
  }
}
    `;

/**
 * __useGetUserFromIdQuery__
 *
 * To run a query within a React component, call `useGetUserFromIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserFromIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserFromIdQuery({
 *   variables: {
 *      getUserFromIdId: // value for 'getUserFromIdId'
 *   },
 * });
 */
export function useGetUserFromIdQuery(baseOptions: Apollo.QueryHookOptions<GetUserFromIdQuery, GetUserFromIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserFromIdQuery, GetUserFromIdQueryVariables>(GetUserFromIdDocument, options);
      }
export function useGetUserFromIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserFromIdQuery, GetUserFromIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserFromIdQuery, GetUserFromIdQueryVariables>(GetUserFromIdDocument, options);
        }
export type GetUserFromIdQueryHookResult = ReturnType<typeof useGetUserFromIdQuery>;
export type GetUserFromIdLazyQueryHookResult = ReturnType<typeof useGetUserFromIdLazyQuery>;
export type GetUserFromIdQueryResult = Apollo.QueryResult<GetUserFromIdQuery, GetUserFromIdQueryVariables>;
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
export const CreateEntryCommentDocument = gql`
    mutation CreateEntryComment($data: TimeEntryCreateInput!) {
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
 *      data: // value for 'data'
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
export const UpdateTimeEntryhoursDocument = gql`
    mutation UpdateTimeEntryhours($updateTimeEntryhoursId: Int!, $data: TimeEntryUpdateInput!) {
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
    mutation DeleteTimeEntry($deleteTimeEntryId: Int!) {
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
    mutation UpdateTimeEntryRow($updateTimeEntryRowId: Int!, $departmentId: Int, $projectId: Int, $workTypeId: Int) {
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
    query GetTimeEntryRow($getTimeEntryRowId: Int!) {
  getTimeEntryRow(id: $getTimeEntryRowId) {
    id
    updatedAt
    workType {
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
    createdAt
    project {
      id
      name
      createdAt
      updatedAt
      isActive
      description
      code
    }
    department {
      id
      name
      createdAt
      updatedAt
      isActive
      description
      projects {
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
    query GetTimeEntryRows($timesheetId: Int!) {
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
    mutation CreateTimeEntryRow($timesheetId: Int!) {
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