/****** Object:  Table [dbo].[TemplateEntry]    Script Date: 2020-08-14 3:27:12 PM ******/
-- Create a template entry table. This table stores the entries in the template and is linked back to a TemplateID.
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[TemplateEntry]
(
	[TemplateEntryID] [int] IDENTITY(1,1) NOT NULL,
	[TemplateID] [int] NOT NULL,
	[ProjectID] [int] NULL,
	[WorkCodeID] [int] NULL,
	[EntryOffset] [int] NOT NULL,
	-- How far over in the timesheet it is located. Is set as offset and not day as tempaltes are not attached to any specific date.
	[HoursWorked] [int] NULL,
	CONSTRAINT [PK_TemplateEntry] PRIMARY KEY CLUSTERED 
(
	[TemplateEntryID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[TemplateEntry]  WITH CHECK ADD  CONSTRAINT [FK_TemplateEntry_Project] FOREIGN KEY([ProjectID])
REFERENCES [dbo].[Project] ([ProjectID])
GO

ALTER TABLE [dbo].[TemplateEntry] CHECK CONSTRAINT [FK_TemplateEntry_Project]
GO

ALTER TABLE [dbo].[TemplateEntry]  WITH CHECK ADD  CONSTRAINT [FK_TemplateEntry_Template] FOREIGN KEY([TemplateID])
REFERENCES [dbo].[Template] ([TemplateID])
GO

ALTER TABLE [dbo].[TemplateEntry] CHECK CONSTRAINT [FK_TemplateEntry_Template]
GO

ALTER TABLE [dbo].[TemplateEntry]  WITH CHECK ADD  CONSTRAINT [FK_TemplateEntry_WorkCode] FOREIGN KEY([WorkCodeID])
REFERENCES [dbo].[WorkCode] ([WorkCodeID])
GO

ALTER TABLE [dbo].[TemplateEntry] CHECK CONSTRAINT [FK_TemplateEntry_WorkCode]
GO


