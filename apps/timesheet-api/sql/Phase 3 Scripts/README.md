# Phase 3 Deploy

Executing the provided script will attempt to make the following changes in a single transaction. If successful, the transaction will be finialized. If unsuccessful, the transaction will be aborted.

## Day Comment Table
A new day comment table will be created. Its fields include:
- DayCommentID: Integer ID of day comment.
- EmployeeID: Foreign key reference to Employee table object.
- DateofComment: Datetime to associate the comment with.
- Comment: String of comment itself.

## Template Table
A new template table will be created to link template entries to an employee. Its fields include:
- TemplateID: Integer ID of template.
- TemplateName: String with the name of the tamplate.
- EmployeeID: Foreign key reference to Employee table object.

## Template Entry Table
A new template entry table will be created to hold the template entries themselves. Its columns include:
- TemplateEntryID: Integer ID of template entry.
- TempalteID: Foreign key reference to Template table object.
- ProjectID: Foreign key reference to Project table object.
- WorkCodeID: Foreign key reference to WorkCode table object.
- HoursWorked: Integer defining the number of hours stored in that time entry.

## Add SubmissionID Column to TimeEntry
The TimeEntry table will receive a new column, SubmissionID, with a foreign key reference to the SubmittedTimesheets table.

## Add SubmissionDate Column to SubmittedTimesheets
The SubmittedTimesheets table will receive a new column, SubmissionDate, with a datetime entry of when it was submitted.

