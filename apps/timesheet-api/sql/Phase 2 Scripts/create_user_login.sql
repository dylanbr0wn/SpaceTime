/****** Object:  Table [dbo].[UserLogin]    Script Date: 2020-07-28 4:29:30 PM ******/
-- Create a user login table to store the username and password. This table is temporary as it will be superseded by AD authentication
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[UserLogin]
(
	[UserID] [int] IDENTITY(1,1) NOT NULL,
	[EmployeeID] [int] NULL,
	[Username] [varchar](50) NULL,
	[Password] [varchar](255) NULL,
	PRIMARY KEY CLUSTERED 
(
	[UserID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[UserLogin] ADD  DEFAULT (NULL) FOR [EmployeeID]
GO

ALTER TABLE [dbo].[UserLogin] ADD  DEFAULT (NULL) FOR [Username]
GO

ALTER TABLE [dbo].[UserLogin] ADD  DEFAULT (NULL) FOR [Password]
GO

ALTER TABLE [dbo].[UserLogin]  WITH CHECK ADD FOREIGN KEY([EmployeeID])
REFERENCES [dbo].[Employee] ([EmployeeID])
GO


