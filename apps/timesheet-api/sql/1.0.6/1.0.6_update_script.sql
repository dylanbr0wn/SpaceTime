/**
1.0.6 Update script

Steps:
1. Create a Preference table and populate with base list of preferences. Will store information on preferences.
2. Create Employee Preference relationship table. Will store most preference values set by employees.
3. Create Pinned Row table. Will store list of pinned rows for employees.

Created by Dylan Brown

**/

SET NUMERIC_ROUNDABORT OFF
GO
SET ANSI_PADDING, ANSI_WARNINGS, CONCAT_NULL_YIELDS_NULL, ARITHABORT, QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
SET XACT_ABORT ON
GO
SET TRANSACTION ISOLATION LEVEL Serializable
GO
BEGIN TRANSACTION
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

CREATE TABLE [dbo].[Preferences]
(
    [PreferenceID] [bigint] IDENTITY(1,1) NOT NULL,
    [PreferenceName] [nvarchar](50) NOT NULL,
    [Description] [nvarchar](255) NULL,
    [PreferenceCode] [nvarchar](50) NULL,
    [PreferenceType] [nvarchar](50) NULL,
    CONSTRAINT [PK_Preferences] PRIMARY KEY CLUSTERED 
(
	[PreferenceID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

INSERT INTO [dbo].[Preferences]
    ([PreferenceName]
    ,[Description]
    ,[PreferenceCode]
    ,[PreferenceType])
VALUES
    ('Template Overwrite', 'Overwrite current timesheet when loading a template.', 'TemplateOverwrite', 'bool'),
    ('Sidebar Pinning', 'Pin the sidebar to always remain open', 'SidebarPin', 'bool'),
    ('Email on Submission', 'Receive an email when a subordinate has submittted their timesheet.', 'EmailOnSubmit', 'bool'),
    ('Check Expected Hours', 'Perform sanity check on number of hours entered compared to the expected amount.', 'CheckExpectedHours', 'bool'),
    ('Expected Hours', 'Number of hours expected in timesheet per period.', 'ExpectedHours', 'number'),
    ('Pinned Rows', 'Rows pinned to top of timesheet.', 'PinnedRows', 'array')
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO


CREATE TABLE [dbo].[EmployeePreference]
(
    [EmployeePreferenceID] [int] IDENTITY(1,1) NOT NULL,
    [EmployeeID] [int] NOT NULL,
    [PreferenceID] [bigint] NOT NULL,
    [Value] [nvarchar](50) NOT NULL,
    CONSTRAINT [PK_EmployeePreference] PRIMARY KEY CLUSTERED 
(
	[EmployeePreferenceID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[EmployeePreference]  WITH CHECK ADD  CONSTRAINT [FK_EmployeePreference_Employee] FOREIGN KEY([EmployeeID])
REFERENCES [dbo].[Employee] ([EmployeeID])
GO

ALTER TABLE [dbo].[EmployeePreference] CHECK CONSTRAINT [FK_EmployeePreference_Employee]
GO

ALTER TABLE [dbo].[EmployeePreference]  WITH CHECK ADD  CONSTRAINT [FK_EmployeePreference_Preferences] FOREIGN KEY([PreferenceID])
REFERENCES [dbo].[Preferences] ([PreferenceID])
GO

ALTER TABLE [dbo].[EmployeePreference] CHECK CONSTRAINT [FK_EmployeePreference_Preferences]
GO

IF @@ERROR <> 0 SET NOEXEC ON
GO

CREATE TABLE [dbo].[EmployeePinnedRows]
(
    [EmployeePinnedRowID] [int] IDENTITY(1,1) NOT NULL,
    [EmployeeID] [int] NOT NULL,
    [DepartmentID] [int] NOT NULL,
    [ProjectID] [int] NOT NULL,
    [WorkCodeID] [int] NOT NULL,
    CONSTRAINT [PK_EmployeePinnedRows] PRIMARY KEY CLUSTERED 
(
	[EmployeePinnedRowID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[EmployeePinnedRows]  WITH CHECK ADD  CONSTRAINT [FK_EmployeePinnedRows_Department] FOREIGN KEY([DepartmentID])
REFERENCES [dbo].[Department] ([DepartmentID])
GO

ALTER TABLE [dbo].[EmployeePinnedRows] CHECK CONSTRAINT [FK_EmployeePinnedRows_Department]
GO

ALTER TABLE [dbo].[EmployeePinnedRows]  WITH CHECK ADD  CONSTRAINT [FK_EmployeePinnedRows_Employee] FOREIGN KEY([EmployeeID])
REFERENCES [dbo].[Employee] ([EmployeeID])
GO

ALTER TABLE [dbo].[EmployeePinnedRows] CHECK CONSTRAINT [FK_EmployeePinnedRows_Employee]
GO

ALTER TABLE [dbo].[EmployeePinnedRows]  WITH CHECK ADD  CONSTRAINT [FK_EmployeePinnedRows_Project] FOREIGN KEY([ProjectID])
REFERENCES [dbo].[Project] ([ProjectID])
GO

ALTER TABLE [dbo].[EmployeePinnedRows] CHECK CONSTRAINT [FK_EmployeePinnedRows_Project]
GO

ALTER TABLE [dbo].[EmployeePinnedRows]  WITH CHECK ADD  CONSTRAINT [FK_EmployeePinnedRows_WorkCode] FOREIGN KEY([WorkCodeID])
REFERENCES [dbo].[WorkCode] ([WorkCodeID])
GO

ALTER TABLE [dbo].[EmployeePinnedRows] CHECK CONSTRAINT [FK_EmployeePinnedRows_WorkCode]
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

COMMIT TRANSACTION
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO
-- This statement writes to the SQL Server Log so SQL Monitor can show this deployment.
DECLARE @Success AS BIT
SET @Success = 1
SET NOEXEC OFF
IF (@Success = 1) PRINT 'The database update succeeded'
ELSE BEGIN
    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION
    PRINT 'The database update failed'
END
GO