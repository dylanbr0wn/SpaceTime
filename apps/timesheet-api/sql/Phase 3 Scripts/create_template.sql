/****** Object:  Table [dbo].[Template]    Script Date: 2020-08-14 3:28:14 PM ******/
-- Create a template table. This table stores the relationship between the employee and their template.
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Template]
(
	[TemplateID] [int] IDENTITY(1,1) NOT NULL,
	[TemplateName] [nvarchar](50) NOT NULL,
	[EmployeeID] [int] NULL,
	CONSTRAINT [PK_Template] PRIMARY KEY CLUSTERED 
(
	[TemplateID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Template]  WITH CHECK ADD  CONSTRAINT [FK_Template_Employee] FOREIGN KEY([EmployeeID])
REFERENCES [dbo].[Employee] ([EmployeeID])
GO

ALTER TABLE [dbo].[Template] CHECK CONSTRAINT [FK_Template_Employee]
GO

