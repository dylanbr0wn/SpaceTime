# Components

This directory contains all React Components in use. These components are sorted into various directories corresponding to subsections of the application.

## React

This is a quick word on the how React components are written throughout this application.

This application uses the ES6 arrow function where applicable and therefore the React Components also follow this convention. React components will always begin with a capital letter and will always return a JSX template of some manner.

## Top Level Components

### [App.js](./App.js)

Will attempt JWT authentication on mount.

This highest level component in the application. This component handles making sure a user is authenticated and which routes they can access accordingly.

### [AuthRoute.js](./AuthRoute.js)

Will reroute to login page if trying to access a route wrapped with AuthRoute and not authenticated

### [PageNotFound.js](./PageNotFound.js)

If a user somehow requests a page that cant be found and no redirect happens. they will be shown this fallback page.

## Common Directory

This directory contains common components that are reused throughout the application. The exeption to this is the Sidebar component, which is placed here for lack of better organization.

### Timesheet

The timesheet interface is common to a few different pages so it lives here. The timesheet includes its own [documentation](./common/timesheet/README.md).

## Style directory

The style directory contains .css files for the entire application. Due to the nature of shared components and the use of Bootstrap, having a common directory for styling was ideal as to not have seperate but similar stylesheets for many components.

## Admin directory

Here lives the unique components associated with the admin pages. This includes components for employee, department, project, and work code management.

## Time Entry directory

Time Entry includes the unique wrapper for the timesheet common component. This wrapper facilitates standard time entry for all employees.

## Manager Tools directory

This directory includes manager/supervisor tools included in the manager dashboard. Principally this includes the manager time entry view, allowing supervisors the ability to edit their subordinates timesheets.

## Login

<WIP\>

## Clerk Tools directory

Here all the tools associated with the payroll clerk are kept. This includes the payroll dashboard and any functionality/pieces associated with that page.
