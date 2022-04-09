/****** Object:  Table [dbo].[TimesheetLock]    Script Date: 2020-10-09 11:43:19 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[TimesheetLock](
	[TimesheetLockID] [int] IDENTITY(1,1) NOT NULL,
	[EmployeetoLock] [int] NOT NULL,
	[LockedBy] [int] NOT NULL,
	[DateofLock] [datetime] NULL
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[TimesheetLock]  WITH CHECK ADD  CONSTRAINT [FK_TimsheetLock_Employee] FOREIGN KEY([EmployeetoLock])
REFERENCES [dbo].[Employee] ([EmployeeID])
GO

ALTER TABLE [dbo].[TimesheetLock] CHECK CONSTRAINT [FK_TimsheetLock_Employee]
GO

ALTER TABLE [dbo].[TimesheetLock]  WITH CHECK ADD  CONSTRAINT [FK_TimsheetLock_Employee1] FOREIGN KEY([LockedBy])
REFERENCES [dbo].[Employee] ([EmployeeID])
GO

ALTER TABLE [dbo].[TimesheetLock] CHECK CONSTRAINT [FK_TimsheetLock_Employee1]
GO


