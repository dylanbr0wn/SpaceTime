USE [Timesheet]
GO

/****** Object:  Table [dbo].[EmployeePreference]    Script Date: 2021-04-07 12:28:13 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[EmployeePreference](
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


