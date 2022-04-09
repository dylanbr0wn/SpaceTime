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
-- Update Template entry table

ALTER TABLE [dbo].[TemplateEntry]
ADD [DepartmentID] [Int] FOREIGN KEY REFERENCES [dbo].[Department]([DepartmentID]);
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO
-- Create timesheet row table

CREATE TABLE [dbo].[TimeEntryRow](
	[TimeEntryRowID] [int] IDENTITY(1,1) NOT NULL,
	[EmployeeID] [int] NOT NULL,
	[ProjectID] [int] NULL,
	[DepartmentID] [int] NULL,
	[WorkCodeID] [int] NULL,
	[SortOrder] [int] NULL,
	[StartDate] [datetime] NOT NULL,
 CONSTRAINT [PK_TimeEntryRow] PRIMARY KEY CLUSTERED 
(
	[TimeEntryRowID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY];
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [dbo].[TimeEntryRow]  WITH CHECK ADD  CONSTRAINT [FK_TimeEntryRow_Department] FOREIGN KEY([DepartmentID])
REFERENCES [dbo].[Department] ([DepartmentID]);
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [dbo].[TimeEntryRow] CHECK CONSTRAINT [FK_TimeEntryRow_Department];
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [dbo].[TimeEntryRow]  WITH CHECK ADD  CONSTRAINT [FK_TimeEntryRow_Employee] FOREIGN KEY([EmployeeID])
REFERENCES [dbo].[Employee] ([EmployeeID]);
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [dbo].[TimeEntryRow] CHECK CONSTRAINT [FK_TimeEntryRow_Employee];
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [dbo].[TimeEntryRow]  WITH CHECK ADD  CONSTRAINT [FK_TimeEntryRow_Project] FOREIGN KEY([ProjectID])
REFERENCES [dbo].[Project] ([ProjectID]);
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

ALTER TABLE [dbo].[TimeEntryRow] CHECK CONSTRAINT [FK_TimeEntryRow_Project];
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

ALTER TABLE [dbo].[TimeEntryRow]  WITH CHECK ADD  CONSTRAINT [FK_TimeEntryRow_WorkCode] FOREIGN KEY([WorkCodeID])
REFERENCES [dbo].[WorkCode] ([WorkCodeID]);
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

ALTER TABLE [dbo].[TimeEntryRow] CHECK CONSTRAINT [FK_TimeEntryRow_WorkCode];
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

--Create timesheet lock table

CREATE TABLE [dbo].[TimesheetLock](
	[TimesheetLockID] [int] IDENTITY(1,1) NOT NULL,
	[EmployeetoLock] [int] NOT NULL,
	[LockedBy] [int] NOT NULL,
	[DateofLock] [datetime] NULL
) ON [PRIMARY];
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

ALTER TABLE [dbo].[TimesheetLock]  WITH CHECK ADD  CONSTRAINT [FK_TimsheetLock_Employee] FOREIGN KEY([EmployeetoLock])
REFERENCES [dbo].[Employee] ([EmployeeID]);
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

ALTER TABLE [dbo].[TimesheetLock] CHECK CONSTRAINT [FK_TimsheetLock_Employee];
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

ALTER TABLE [dbo].[TimesheetLock]  WITH CHECK ADD  CONSTRAINT [FK_TimsheetLock_Employee1] FOREIGN KEY([LockedBy])
REFERENCES [dbo].[Employee] ([EmployeeID]);
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

ALTER TABLE [dbo].[TimesheetLock] CHECK CONSTRAINT [FK_TimsheetLock_Employee1];
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