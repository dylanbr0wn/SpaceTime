A small summary of the changes that have been made to the Timesheet application since going into production.

#### 1.0.8

##### Features

- Add a show comments screen and a corresponding print button
- Add a better file name for pdfs

##### Bug Fixes

- Fixed a bug with admin pages edit screens not updating correctly
- Fixed a bug with pin inputs
- Fixes to the authentication

#### 1.0.7

##### Bug Fixes

- Fixed a bug where large timesheets were unable to be submitted due to payload size
- Fixed a bug with date formatting for MomentJS

#### 1.0.6

##### Features

- Fix page scaling issues
- Fix clerk tools to be appropriate for new system
- Defaults to hide changelog, uses button to show
- Now clears extra rows on submit.
- Add day comments to print out.
- Remove non-export work codes from print out.
- Add Easter Monday holiday.
- A preferences page for view info and change some settings.
- Can now toggle between template overwrite and add
- Can now toggle on and off email from subordinate submissions.
- More tool tips.
- User preferences are moved to the database. This means that when you switch between browsers, preferences will not change.
- Inital testing. Few tests written for timesheet components, will be ongoing work.

##### Bug Fixes

- Prevent higher level users from being allowed to enter duplicate rows
- fix sort rows on manager and payroll screens
- stop duplicate rows showing up at all
- Spelling and spacing issues

#### 1.0.5

##### Features

- Add row pinning.
- Add sorting of rows, both initally and manually with a button.
- Change the load template to add only the rows that are not present already in timesheet.
- Add button to remove unused rows, rows without any current hours logged, of the timesheet.
- Create a script to create a "Old Timesheet" template that includes the configuration of the old timesheet.
- A loading screen which should appear before load.

##### Bug Fixes

- Fix problem with department/project showing up as undefined and other cases involving these fields causing fragiles states that could cause unrecoverable errors.
- Fix multiple email issue.
- Widden the Project column and shrink departments.
- Fix mobile view showing wrong work code.
- Fix logic in project checking preventing two rows with now workcodes.
- Fix template load process.

#### 1.0.4

##### Bug Fixes

- Fix multiple entries with the same department, project, work code combo causing mass destruction of timesheets.
- Fix edge case where updating a comment when the comment is changing in server will revert comment state unexpectedly.

#### 1.0.3

##### Features

- Add comment column to timesheet printout.
- Add comment length indicator to comment inputs.
- Increase entry comment length from 50 characters to 255 characters.
- Add email notifications to managers upon employee submission.
- Add routing on inital load. This means links will now go where they are suppose to instead of just to the user timesheet. Additionally reloads now will also reload the current page and not redirect back to own timesheet.

##### Bug Fixes

- Fix dynamics export. AGAIN AGAIN.
- Fix issue where inactive users are allowed to login.

#### 1.0.2

##### Bug Fixes

- Fix an issue where permissions prevented payroll clerk from seeing users work codes.
- Fix an issue where users would be able to update timesheet after it had been approved.
- Fix an issue where multiple approvals can be created for a single timesheet.
- Date range on printout now shows correct dates.
- Fix dynamics export, again.
- When a time entry is removed, the comment is now removed from redux too.

#### 1.0.1

##### Features

- Add support for showing the descriptions of projects.
- Add tooltips throughout the application.

##### Bug Fixes

- Fix an issue where inactive projects where not being filtered.
- Fix an issue where, in rare cases, manager dashboard was broken.
- Fix dependancy issues.

#### 1.0.0

##### Features

- New coat of paint. Timesheet has transitioned to the new branding, colors, and font.
- Legacy comments and submission status now show on submissions for old timesheet system.
- Lock date picking in timesheet to only allow dates every 14 days prior and after the current cut-off date. This ensures statuses are shown correctly.

##### Bug Fixes

- Fixed an issue where submission dates where not displaying correctly.
- Fixed an issue where timesheet would lock future dates in some cases.
- Switched the default actions for approval process.
- Fix admin permissions in payroll timesheet.
- Fixed an issue entering dates less than 1.
- Fixed lock icons to be more clear.
