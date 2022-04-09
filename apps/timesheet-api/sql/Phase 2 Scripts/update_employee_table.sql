-- Add columns for administartor role and payroll clerk roll into employee table.
ALTER TABLE [dbo].[Employee]
ADD IsAdministrator BIT NOT NULL
	DEFAULT (0),
	IsPayrollClerk BIT NOT NULL
	DEFAULT (0);