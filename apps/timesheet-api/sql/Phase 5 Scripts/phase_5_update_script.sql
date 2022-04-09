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
CREATE TABLE [dbo].[TimesheetApprovals](
	[ApprovalID] [int] IDENTITY(1,1) NOT NULL,
	[SubmissionID] [bigint] NULL,
	[ApprovalStatus] [int] NULL,
	[LastUpdated] [datetime] NULL,
	[SupervisorComment] [nvarchar](250) NULL,
	[PayrollComment] [nvarchar](250) NULL
) ON [PRIMARY]
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

ALTER TABLE [dbo].[TimesheetApprovals]  WITH CHECK ADD  CONSTRAINT [FK_TimesheetApprovals_SubmittedTimesheets] FOREIGN KEY([SubmissionID])
REFERENCES [dbo].[SubmittedTimesheets] ([SubmissionID])
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

ALTER TABLE [dbo].[TimesheetApprovals] CHECK CONSTRAINT [FK_TimesheetApprovals_SubmittedTimesheets]
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

ALTER TABLE TemplateEntry
DROP COLUMN EntryOffset;
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