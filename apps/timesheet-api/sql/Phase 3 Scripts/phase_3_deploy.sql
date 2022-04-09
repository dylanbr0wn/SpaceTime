/*
Run this script on:

        Timesheet    -  This database will be modified

to synchronize it with:

        Test Database

You are recommended to back up your database before running this script

Script created by SQL Compare version 14.3.3.16559 from Red Gate Software Ltd at 2020-09-15 10:47:54 AM

*/
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
PRINT N'Creating [dbo].[DayComment]'
GO
CREATE TABLE [dbo].[DayComment]
(
        [DayCommentID] [int] NOT NULL IDENTITY(1, 1),
        [EmployeeID] [int] NOT NULL,
        [DateofComment] [datetime] NOT NULL,
        [Comment] [nvarchar] (256) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL
)
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO
PRINT N'Altering [dbo].[SubmittedTimesheets]'
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [dbo].[SubmittedTimesheets] ADD
[SubmissionDate] [datetime] NULL
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO
PRINT N'Creating [dbo].[Template]'
GO
CREATE TABLE [dbo].[Template]
(
        [TemplateID] [int] NOT NULL IDENTITY(1, 1),
        [TemplateName] [nvarchar] (50) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
        [EmployeeID] [int] NULL
)
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO
PRINT N'Creating primary key [PK_Template] on [dbo].[Template]'
GO
ALTER TABLE [dbo].[Template] ADD CONSTRAINT [PK_Template] PRIMARY KEY CLUSTERED  ([TemplateID])
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO
PRINT N'Creating [dbo].[TemplateEntry]'
GO
CREATE TABLE [dbo].[TemplateEntry]
(
        [TemplateEntryID] [int] NOT NULL IDENTITY(1, 1),
        [TemplateID] [int] NOT NULL,
        [ProjectID] [int] NULL,
        [WorkCodeID] [int] NULL,
        [EntryOffset] [int] NOT NULL,
        [HoursWorked] [int] NULL
)
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO
PRINT N'Creating primary key [PK_TemplateEntry] on [dbo].[TemplateEntry]'
GO
ALTER TABLE [dbo].[TemplateEntry] ADD CONSTRAINT [PK_TemplateEntry] PRIMARY KEY CLUSTERED  ([TemplateEntryID])
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO
PRINT N'Altering [dbo].[TimeEntry]'
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO
ALTER TABLE [dbo].[TimeEntry] ADD
[SubmissionID] [bigint] NULL
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO
PRINT N'Refreshing [dbo].[vTimeEntryReport]'
GO
EXEC sp_refreshview N'[dbo].[vTimeEntryReport]'
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO
PRINT N'Refreshing [dbo].[vProjectHoursReport]'
GO
EXEC sp_refreshview N'[dbo].[vProjectHoursReport]'
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO
PRINT N'Adding foreign keys to [dbo].[DayComment]'
GO
ALTER TABLE [dbo].[DayComment] ADD CONSTRAINT [FK_DayComment_Employee] FOREIGN KEY ([EmployeeID]) REFERENCES [dbo].[Employee] ([EmployeeID])
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO
PRINT N'Adding foreign keys to [dbo].[TemplateEntry]'
GO
ALTER TABLE [dbo].[TemplateEntry] ADD CONSTRAINT [FK_TemplateEntry_Template] FOREIGN KEY ([TemplateID]) REFERENCES [dbo].[Template] ([TemplateID])
GO
ALTER TABLE [dbo].[TemplateEntry] ADD CONSTRAINT [FK_TemplateEntry_Project] FOREIGN KEY ([ProjectID]) REFERENCES [dbo].[Project] ([ProjectID])
GO
ALTER TABLE [dbo].[TemplateEntry] ADD CONSTRAINT [FK_TemplateEntry_WorkCode] FOREIGN KEY ([WorkCodeID]) REFERENCES [dbo].[WorkCode] ([WorkCodeID])
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO
PRINT N'Adding foreign keys to [dbo].[Template]'
GO
ALTER TABLE [dbo].[Template] ADD CONSTRAINT [FK_Template_Employee] FOREIGN KEY ([EmployeeID]) REFERENCES [dbo].[Employee] ([EmployeeID])
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO
PRINT N'Adding foreign keys to [dbo].[TimeEntry]'
GO
ALTER TABLE [dbo].[TimeEntry] ADD CONSTRAINT [FK_TimeEntry_Submission] FOREIGN KEY ([SubmissionID]) REFERENCES [dbo].[SubmittedTimesheets] ([SubmissionID])
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO
COMMIT TRANSACTION
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO
-- This statement writes to the SQL Server Log so SQL Monitor can show this deployment.
IF HAS_PERMS_BY_NAME(N'sys.xp_logevent', N'OBJECT', N'EXECUTE') = 1
BEGIN
        DECLARE @databaseName AS nvarchar(2048), @eventMessage AS nvarchar(2048)
        SET @databaseName = REPLACE(REPLACE(DB_NAME(), N'\', N'\\'), N'"', N'\"')
        SET @eventMessage = N'Redgate SQL Compare: { "deployment": { "description": "Redgate SQL Compare deployed to ' + @databaseName + N'", "database": "' + @databaseName + N'" }}'
        EXECUTE sys.xp_logevent 55000, @eventMessage
END
GO
DECLARE @Success AS BIT
SET @Success = 1
SET NOEXEC OFF
IF (@Success = 1) PRINT 'The database update succeeded'
ELSE BEGIN
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION
        PRINT 'The database update failed'
END
GO
