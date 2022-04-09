USE [Timesheet]
GO

/****** Object:  Table [dbo].[EmployeePinnedRows]    Script Date: 2021-04-12 11:25:06 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[EmployeePinnedRows](
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


