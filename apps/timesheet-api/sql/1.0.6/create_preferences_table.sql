USE [Timesheet]
GO

/****** Object:  Table [dbo].[Preferences]    Script Date: 2021-04-07 12:27:01 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Preferences]
(
	[PreferenceID] [bigint] IDENTITY(1,1) NOT NULL,
	[PreferenceName] [nvarchar](50) NOT NULL,
	[Description] [nvarchar](255) NULL,
	[PreferenceCode] [nvarchar](50) NULL,
	[PreferenceType] [nvarchar](50) NULL,
	CONSTRAINT [PK_Preferences] PRIMARY KEY CLUSTERED 
(
	[PreferenceID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

INSERT INTO [dbo].[Preferences]
	([PreferenceName]
	,[Description]
	,[PreferenceCode]
	,[PreferenceType])
VALUES
	('Template Overwrite', 'Overwrite current timesheet when loading a template.', 'TemplateOverwrite', 'bool'),
	('Sidebar Pinning', 'Pin the sidebar to always remain open', 'SidebarPin', 'bool'),
	('Email on Submission', 'Receive an email when a subordinate has submittted their timesheet.', 'EmailOnSubmit', 'bool'),
	('Check Expected Hours', 'Perform sanity check on number of hours entered compared to the expected amount.', 'CheckExpectedHours', 'bool'),
	('Expected Hours', 'Number of hours expected in timesheet per period.', 'ExpectedHours', 'number'),
	('Pinned Rows', 'Rows pinned to top of timesheet.', 'PinnedRows', 'array')
GO
