
/****** Object:  Table [dbo].[TimeEntryRow]    Script Date: 2020-10-20 5:11:32 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[TimeEntryRow](
	[TimeEntryRowID] [int] IDENTITY(1,1) NOT NULL,
	[EmployeeID] [int] NOT NULL,
	[ProjectID] [int] NULL,
	[DepartmentID] [int] NULL,
	[WorkCodeID] [int] NULL,
	[SortOrder] [int] NOT NULL
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[TimeEntryRow]  WITH CHECK ADD  CONSTRAINT [FK_TimeEntryRow_Department] FOREIGN KEY([DepartmentID])
REFERENCES [dbo].[Department] ([DepartmentID])
GO

ALTER TABLE [dbo].[TimeEntryRow] CHECK CONSTRAINT [FK_TimeEntryRow_Department]
GO

ALTER TABLE [dbo].[TimeEntryRow]  WITH CHECK ADD  CONSTRAINT [FK_TimeEntryRow_Employee] FOREIGN KEY([EmployeeID])
REFERENCES [dbo].[Employee] ([EmployeeID])
GO

ALTER TABLE [dbo].[TimeEntryRow] CHECK CONSTRAINT [FK_TimeEntryRow_Employee]
GO

ALTER TABLE [dbo].[TimeEntryRow]  WITH CHECK ADD  CONSTRAINT [FK_TimeEntryRow_Project] FOREIGN KEY([ProjectID])
REFERENCES [dbo].[Project] ([ProjectID])
GO

ALTER TABLE [dbo].[TimeEntryRow] CHECK CONSTRAINT [FK_TimeEntryRow_Project]
GO

ALTER TABLE [dbo].[TimeEntryRow]  WITH CHECK ADD  CONSTRAINT [FK_TimeEntryRow_WorkCode] FOREIGN KEY([WorkCodeID])
REFERENCES [dbo].[WorkCode] ([WorkCodeID])
GO

ALTER TABLE [dbo].[TimeEntryRow] CHECK CONSTRAINT [FK_TimeEntryRow_WorkCode]
GO


