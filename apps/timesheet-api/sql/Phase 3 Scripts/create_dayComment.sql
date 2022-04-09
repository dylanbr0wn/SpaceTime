/****** Object:  Table [dbo].[DayComment]    Script Date: 2020-08-18 2:36:50 PM ******/
-- Create a day columns table. 
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[DayComment]
(
	[DayCommentID] [int] IDENTITY(1,1) NOT NULL,
	[EmployeeID] [int] NOT NULL,
	[DateofComment] [datetime] NOT NULL,
	[Comment] [nvarchar](256) NOT NULL
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[DayComment]  WITH CHECK ADD  CONSTRAINT [FK_DayComment_Employee] FOREIGN KEY([EmployeeID])
REFERENCES [dbo].[Employee] ([EmployeeID])
GO

ALTER TABLE [dbo].[DayComment] CHECK CONSTRAINT [FK_DayComment_Employee]
GO

