<a name="top"></a>
# Routes

Timesheet system API for City of Langford.

 - [Authentication](#Authentication)
   - [JwtAuth](#JwtAuth)
   - [Login](#Login)
   - [Logout](#Logout)
 - [Employee](#Employee)
   - [Create Employee.](#Create-Employee.)
   - [Read Employee Templates.](#Read-Employee-Templates.)
   - [Read Employee Time Entries.](#Read-Employee-Time-Entries.)
   - [Read Employee Time Sheet.](#Read-Employee-Time-Sheet.)
   - [Read Employee Work Codes.](#Read-Employee-Work-Codes.)
   - [Read Employee.](#Read-Employee.)
   - [Read Employees.](#Read-Employees.)
   - [Update Employee.](#Update-Employee.)
 - [Objects](#Objects)
   - [Create Department](#Create-Department)
   - [Create Project](#Create-Project)
   - [Create Work Code](#Create-Work-Code)
   - [Get Objects](#Get-Objects)
   - [Update Department](#Update-Department)
   - [Update Project](#Update-Project)
   - [Update Settings](#Update-Settings)
   - [Update Work Code](#Update-Work-Code)
 - [Reports](#Reports)
   - [Dynamics Report](#Dynamics-Report)
   - [Employee Timesheet Report](#Employee-Timesheet-Report)
   - [Tardy Employee Report](#Tardy-Employee-Report)
 - [TimeEntry](#TimeEntry)
   - [Create a template.](#Create-a-template.)
   - [Create a time entry.](#Create-a-time-entry.)
   - [Create day comment.](#Create-day-comment.)
   - [Delete a day comment.](#Delete-a-day-comment.)
   - [Delete a template.](#Delete-a-template.)
   - [Delete a time entry.](#Delete-a-time-entry.)
   - [Delete Row.](#Delete-Row.)
   - [Load a template.](#Load-a-template.)
   - [Submit Timesheet.](#Submit-Timesheet.)
   - [Update a template.](#Update-a-template.)
   - [Update a time entry.](#Update-a-time-entry.)
   - [Update day comment.](#Update-day-comment.)
   - [Update Row.](#Update-Row.)
 - [User](#User)
   - [Change User Password](#Change-User-Password)
   - [Create User](#Create-User)

___


# <a name='Authentication'></a> Authentication

## <a name='JwtAuth'></a> JwtAuth
[Back to top](#top)

<p>Get call to authorize the JWT from a user for login purposes.</p>

```
GET /auth/jwt
```

## <a name='Login'></a> Login
[Back to top](#top)

<p>Login a user to the timesheet system.</p>

```
POST /auth/login
```

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| username | `String` | <p>username to login.</p> |
| password | `String` | <p>password to verify.</p> |

## <a name='Logout'></a> Logout
[Back to top](#top)

<p>Post call to logout a user from their JWT. This call will blacklist their JWT until its expiry, when it will be deleted. This blacklist is stored in memory using redis and the jwt-redis library.</p>

```
POST /auth/logout
```

# <a name='Employee'></a> Employee

## <a name='Create-Employee.'></a> Create Employee.
[Back to top](#top)

<p>Create a new employee.</p>

```
POST /employee
```

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| employee | `Object` | <p>Employee information to create new employee.</p> |
| workCodes | `Object` | <p>Work codes to attach to new employee.</p> |

## <a name='Read-Employee-Templates.'></a> Read Employee Templates.
[Back to top](#top)

<p>Read templates associated with an employee ID.</p>

```
GET /:id/templates
```

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| id | `Number` | <p>Employee ID to fetch templates.</p> |

## <a name='Read-Employee-Time-Entries.'></a> Read Employee Time Entries.
[Back to top](#top)

<p>Read time entries associated with an employee ID in a time frame.</p>

```
GET /:id/timeEntries
```

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| id | `Number` | <p>Employee ID to fetch time entries.</p> |
| startDate | `String` | <p>Date string specifying the first day of timesheet to fetch entries for.</p> |

## <a name='Read-Employee-Time-Sheet.'></a> Read Employee Time Sheet.
[Back to top](#top)

<p>Read timesheet associated with an employee ID in a time frame. Includes day comments.</p>

```
GET /:id/timeSheet
```

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| id | `Number` | <p>Employee ID to fetch time sheet.</p> |
| startDate | `String` | <p>Date string specifying the first day of timesheet to fetch entries for.</p> |

## <a name='Read-Employee-Work-Codes.'></a> Read Employee Work Codes.
[Back to top](#top)

<p>Read work codes associated with an employee id.</p>

```
GET /:id/workCodes
```

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| id | `Number` | <p>Employee ID to fetch work codes.</p> |

## <a name='Read-Employee.'></a> Read Employee.
[Back to top](#top)

<p>Read an employee.</p>

```
GET /employee/:id
```

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| id | `Number` | <p>Employee ID to fetch information for.</p> |

## <a name='Read-Employees.'></a> Read Employees.
[Back to top](#top)

<p>Read all employees.</p>

```
GET /employee
```

## <a name='Update-Employee.'></a> Update Employee.
[Back to top](#top)

<p>Update a employee.</p>

```
PUT /employee/:id
```

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| id | `Number` | <p>Employee ID to update.</p> |
| employee | `Object` | <p>Employee information to create new employee.</p> |
| workCodes | `Object` | <p>Work codes to attach to new employee.</p> |

# <a name='Objects'></a> Objects

## <a name='Create-Department'></a> Create Department
[Back to top](#top)

<p>Create a new department.</p>

```
POST /object/department
```

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| DeptName | `String` | <p>Name of department.</p> |
| IsActive | `Boolean` | <p>Is this department active.</p> |

## <a name='Create-Project'></a> Create Project
[Back to top](#top)

<p>Create a new project.</p>

```
POST /object/project
```

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| DepartmentID | `Number` | <p>The department running the project.</p> |
| GLCode | `String` |  |
| DeptCode | `String` |  |
| Name | `String` | <p>Project name.</p> |
| Description | `String` | <p>Project description.</p> |
| IsActive | `Boolean` | <p>Is this project active.</p> |

## <a name='Create-Work-Code'></a> Create Work Code
[Back to top](#top)

<p>Create a new work code.</p>

```
POST /object/workCode
```

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| Code | `String` |  |
| Description | `String` | <p>Work code description.</p> |
| IsDefault | `Boolean` | <p>Is this work code a default.</p> |
| ExportToDynamics | `Boolean` | <p>Is this work code exported in dynamics report.</p> |
| Multiplier | `Number` | <p>Wage multiplier.</p> |

## <a name='Get-Objects'></a> Get Objects
[Back to top](#top)

<p>Get timesheet objects</p>

```
GET /object/
```

## <a name='Update-Department'></a> Update Department
[Back to top](#top)

<p>Update a department.</p>

```
PUT /object/department/:id
```

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| id | `Number` | <p>Department ID.</p> |
| DeptName | `String` | <p>Name of department.</p> |
| IsActive | `Boolean` | <p>Is this department active.</p> |

## <a name='Update-Project'></a> Update Project
[Back to top](#top)

<p>Update a project.</p>

```
PUT /object/project/:id
```

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| id | `Number` | <p>Project ID.</p> |
| DepartmentID | `Number` | <p>The department running the project.</p> |
| GLCode | `String` |  |
| DeptCode | `String` |  |
| Name | `String` | <p>Project name.</p> |
| Description | `String` | <p>Project description.</p> |
| IsActive | `Boolean` | <p>Is this project active.</p> |

## <a name='Update-Settings'></a> Update Settings
[Back to top](#top)

<p>Update timesheet settings.</p>

```
PUT /object/settings
```

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| HoursPerDay. | `Number` |  |
| RecordID. | `Number` |  |
| SharepointURLForApproval | `String` | <p>URL of sharepoint approval repository.</p> |
| CutOffDate | `String` | <p>Time sheet cut off date.</p> |

## <a name='Update-Work-Code'></a> Update Work Code
[Back to top](#top)

<p>Update a work code.</p>

```
PUT /object/workCode/:id
```

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| id | `Number` | <p>Work code id.</p> |
| Code | `String` |  |
| Description | `String` | <p>Work code description.</p> |
| IsDefault | `Boolean` | <p>Is this work code a default.</p> |
| ExportToDynamics | `Boolean` | <p>Is this work code exported in dynamics report.</p> |
| Multiplier | `Number` | <p>Wage multiplier.</p> |

# <a name='Reports'></a> Reports

## <a name='Dynamics-Report'></a> Dynamics Report
[Back to top](#top)

<p>Execute procedure to create a dynamics report.</p>

```
GET /report/dynamics
```

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| startDate | `String` | <p>Start date of dynamics report.</p> |
| endDate | `String` | <p>End date of dynamics report.</p> |

## <a name='Employee-Timesheet-Report'></a> Employee Timesheet Report
[Back to top](#top)

<p>Execute procedure to create an employee timesheet report.</p>

```
GET /report/employeeTimeSheet
```

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| startDate | `String` | <p>Start date of report.</p> |
| endDate | `String` | <p>End date of report.</p> |
| employeeID | `Number` | <p>Employee ID for report.</p> |

## <a name='Tardy-Employee-Report'></a> Tardy Employee Report
[Back to top](#top)

<p>Execute procedure to create a tardy employee report.</p>

```
GET /report/tardyEmployees
```

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| startDate | `String` | <p>Start date of report.</p> |

# <a name='TimeEntry'></a> TimeEntry

## <a name='Create-a-template.'></a> Create a template.
[Back to top](#top)

<p>Create a template in the Template and TemplateEntries tables.</p>

```
POST /timeEntry/template
```

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| EmployeeID | `Number` | <p>Employee ID for template.</p> |
| TemplateName | `String` | <p>Name of template.</p> |
| Entries | `Object` | <p>Time sheet entries to add into template.</p> |

## <a name='Create-a-time-entry.'></a> Create a time entry.
[Back to top](#top)

<p>Create a new time entry.</p>

```
POST /timeEntry
```

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| EmployeeID | `Number` | <p>Employee ID for time entry.</p> |
| ProjectID | `Number` | <p>Project ID for entry.</p> |
| WorkCodeID | `Number` | <p>Work code ID for entry.</p> |
| HoursWorked | `Number` | <p>Number of hours worked in entry.</p> |
| DateofWork | `String` | <p>Date string for day of time entry work.</p> |
| Comment | `String` |  |

## <a name='Create-day-comment.'></a> Create day comment.
[Back to top](#top)

<p>Create a day comment in the DayComment table.</p>

```
POST /timeEntry/dayComment
```

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| EmployeeID | `Number` | <p>Employee ID for day comment.</p> |
| DateofComment | `String` | <p>Date string for day comment.</p> |
| Comment | `String` |  |

## <a name='Delete-a-day-comment.'></a> Delete a day comment.
[Back to top](#top)

<p>Delete a day comment in the DayComment table.</p>

```
DELETE /timeEntry/dayComment/:id
```

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| id | `Number` | <p>Time entry ID.</p> |

## <a name='Delete-a-template.'></a> Delete a template.
[Back to top](#top)

<p>Delete a template in the Template and TemplateEntries tables.</p>

```
DELETE /timeEntry/template/:id
```

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| id | `Number` | <p>Template ID for template and entries.</p> |

## <a name='Delete-a-time-entry.'></a> Delete a time entry.
[Back to top](#top)

<p>Delete a time entry.</p>

```
DELETE /timeEntry/:id
```

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| id | `Number` | <p>Time entry ID to delete.</p> |

## <a name='Delete-Row.'></a> Delete Row.
[Back to top](#top)

<p>Delete a whole row of time entries.</p>

```
DELETE /timeEntry/deleteRow
```

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| row | `Object` | <p>Row of entries to delete.</p> |

## <a name='Load-a-template.'></a> Load a template.
[Back to top](#top)

<p>Clear current timesheet and load a template.</p>

```
POST /timeEntry/template/:id
```

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| id | `Number` | <p>Template ID for template and entries.</p> |
| timeSheet | `Object` | <p>Time sheet entries to clear.</p> |
| EmployeeID | `Number` | <p>Employee ID for template.</p> |
| startDate | `String` | <p>Date string for start of timesheet.</p> |

## <a name='Submit-Timesheet.'></a> Submit Timesheet.
[Back to top](#top)

<p>Submit a timesheet.</p>

```
POST /timeEntry/submit
```

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| timeSheet | `Array` | <p>Array of time entry rows.</p> |
| employeeID | `Number` | <p>ID of an employee.</p> |
| lastDay | `Date` | <p>Last day of timesheet.</p> |

## <a name='Update-a-template.'></a> Update a template.
[Back to top](#top)

<p>Update a template in the Template and TemplateEntries tables.</p>

```
PUT /timeEntry/template/:id
```

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| id | `Number` | <p>TEmplate ID for template and entries.</p> |
| Entries | `Object` | <p>Time sheet entries to update into template.</p> |
| EmployeeID | `Number` | <p>Employee ID for template.</p> |

## <a name='Update-a-time-entry.'></a> Update a time entry.
[Back to top](#top)

<p>Update a time entry.</p>

```
PUT /timeEntry/:id
```

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| id | `Number` | <p>Time entry ID to update.</p> |
| EmployeeID | `Number` | <p>Employee ID for time entry.</p> |
| ProjectID | `Number` | <p>Project ID for entry.</p> |
| WorkCodeID | `Number` | <p>Work code ID for entry.</p> |
| HoursWorked | `Number` | <p>Number of hours worked in entry.</p> |
| DateofWork | `String` | <p>Date string for day of time entry work.</p> |
| Comment | `String` |  |

## <a name='Update-day-comment.'></a> Update day comment.
[Back to top](#top)

<p>Update a day comment in the DayComment table.</p>

```
PUT timeEntry/dayComment/:id
```

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| id | `Number` | <p>Time entry ID.</p> |
| comment | `String` |  |

## <a name='Update-Row.'></a> Update Row.
[Back to top](#top)

<p>Update a whole row of time entries.</p>

```
PUT /timeEntry/updateRow
```

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| row | `Object` | <p>Row of entries to update.</p> |

# <a name='User'></a> User

## <a name='Change-User-Password'></a> Change User Password
[Back to top](#top)

<p>Update a user password.</p>

```
PUT /user/changePassword/:id
```

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| id | `Number` | <p>User ID wishing to change their password.</p> |
| password | `String` | <p>Password to update to.</p> |

## <a name='Create-User'></a> Create User
[Back to top](#top)

<p>Create a new user in the UserLogin table.</p>

```
POST /user/
```

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| EmployeeID | `Number` | <p>Employee ID attached to new user.</p> |
| Username | `String` | <p>Username for new user.</p> |
| Password | `String` | <p>Password for new user.</p> |
