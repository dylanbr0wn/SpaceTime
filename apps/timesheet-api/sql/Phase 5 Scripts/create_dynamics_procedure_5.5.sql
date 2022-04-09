USE [Timesheet]
GO

/****** Object:  StoredProcedure [dbo].[pDynamicsExport]    Script Date: 2020-12-22 12:33:08 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		  Devon Greenway
-- Create date: 2008-01-02
-- Description:	Get the data for the export to dynamics of the timesheet info

-- Change: 2008-02-18 TC: removed the out parameter @TotalHours
-- Change: 2020-12-22 DB: Changed date format
-- =============================================
CREATE PROCEDURE [dbo].[pDynamicsExport2]
( @StartDate datetime
  , @EndDate datetime
 -- , @TotalHours decimal(9,4) out
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

--SELECT @TotalHours = SUM(HoursWorked)
--FROM vTimeEntryReport
--WHERE DateofWork BETWEEN @StartDate AND @EndDate



SELECT 'A' AS Filler1
	, DiamondEmpID AS EmpID
	, DeptCode
  , CONVERT(varchar(10), DateOfWork,101) AS TransDate
  , CAST(SUM(HoursWorked)*100 AS int) AS Hours
	, NULL AS JobCode
	, NULL AS PhaseCode
	, 'BC' AS ProvinceWorked
	, NULL AS ReferenceString
	, NULL AS ReferenceStringNumeric
	, NULL AS LineTotal
	, NULL AS UserID
	, WorkCode AS PayCode
	, NULL AS PayRollCodeType
	, NULL AS PayCodeDescription
	, NULL AS FurtherIdentification
	, NULL AS PayCodeReference
	, NULL AS PayRate
	, NULL AS PaidBy
	, NULL AS PayType
	, 'CPY' AS DocumentSource
	, NULL AS JobTitle
	, 'T' AS TransactionEntry
	, NULL AS Filler2
	, '@' AS Filler3
	
FROM vTimeEntryReport
WHERE ExportToDynamics=1
GROUP BY DiamondEmpID, DateofWork, DeptCode, WorkCode, ExportToDynamics
HAVING DateofWork BETWEEN @StartDate AND @EndDate
ORDER BY DiamondEmpID, DateofWork, DeptCode, WorkCode

END
GO


