/****** Object:  Index [DateOfWork]    Script Date: 2020-07-15 12:45:57 PM ******/
-- Create a index for the DateofWork column in the time entry table to speed up timesheet and report loading times.
CREATE NONCLUSTERED INDEX [DateOfWork] ON [dbo].[TimeEntry]
(
	[DateofWork] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]



