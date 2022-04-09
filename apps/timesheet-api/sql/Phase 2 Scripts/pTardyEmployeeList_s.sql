/****** Object:  StoredProcedure [dbo].[pTardyEmployeeList_s]    Script Date: 2020-07-14 5:39:24 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		  Ted Corpus
-- Create date: 2008-2-4
-- Description:	Get a list of employees that have not put ANY time into the timesheet.
-- Editted on 2020-09-01 by Dylan Brown - Format output for new system
-- =============================================
ALTER PROCEDURE [dbo].[pTardyEmployeeList_s]
  (
  @StartDate datetime
,
  @EndDate datetime
)
AS
BEGIN

  SET NOCOUNT ON;

  SELECT DISTINCT Employee.*
  FROM Employee LEFT JOIN (SELECT TimeEntryID, EmployeeID
    FROM TimeEntry
    WHERE DateofWork BETWEEN @StartDate AND @EndDate) AS T
    ON T.EmployeeID = Employee.EmployeeID
  WHERE T.TimeEntryID IS NULL
    AND Employee.IsActive = 1

END
