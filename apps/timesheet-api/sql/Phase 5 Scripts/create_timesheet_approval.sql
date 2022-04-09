
/****** Object:  Table [dbo].[TimesheetApprovals]    Script Date: 2020-12-20 4:08:25 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
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

ALTER TABLE [dbo].[TimesheetApprovals]  WITH CHECK ADD  CONSTRAINT [FK_TimesheetApprovals_SubmittedTimesheets] FOREIGN KEY([SubmissionID])
REFERENCES [dbo].[SubmittedTimesheets] ([SubmissionID])
GO

ALTER TABLE [dbo].[TimesheetApprovals] CHECK CONSTRAINT [FK_TimesheetApprovals_SubmittedTimesheets]
GO


