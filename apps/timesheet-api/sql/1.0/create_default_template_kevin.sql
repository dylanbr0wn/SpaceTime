SET NUMERIC_ROUNDABORT OFF
GO
SET ANSI_PADDING, ANSI_WARNINGS, CONCAT_NULL_YIELDS_NULL, ARITHABORT, QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
SET XACT_ABORT ON
GO
SET TRANSACTION ISOLATION LEVEL Serializable
GO
BEGIN TRANSACTION
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

DECLARE @EmployeeList TABLE(EmployeeID INT)
DECLARE @EmployeeID INT

DECLARE @TemplateList TABLE(TemplateID INT,
	EmployeeID INT)

INSERT @EmployeeList
	(EmployeeID)
SELECT DISTINCT Employee.EmployeeID
FROM EmployeeProject
	LEFT JOIN Employee ON EmployeeProject.EmployeeID = Employee.EmployeeID
WHERE Employee.IsActive = 1 AND Employee.EmployeeID = 176;

WHILE(1 = 1)
BEGIN

	SET @EmployeeID = NULL
	SELECT TOP(1)
		@EmployeeID = EmployeeID
	FROM @EmployeeList


	IF @EmployeeID IS NULL
        BREAK

	INSERT INTO Template
		(TemplateName, EmployeeID)
	OUTPUT inserted.TemplateID, inserted.EmployeeID INTO @TemplateList
	VALUES
		('Old Timesheet', @EmployeeID);

	DELETE TOP(1) FROM @EmployeeList

END


DECLARE @TemplateID INT

WHILE(1= 1)
BEGIN
	SET @TemplateID = NULL
	SELECT TOP(1)
		@TemplateID = TemplateID
	FROM @TemplateList

	IF @TemplateID IS NULL
		BREAK

	INSERT INTO TemplateEntry
		(TemplateID, ProjectID, WorkCodeID, HoursWorked, DepartmentID)
	SELECT @TemplateID as TemplateID, EmployeeProject.ProjectID, ProjectWorkCode.WorkCodeID, NULL AS HoursWorked, Project.DepartmentID
	FROM @TemplateList AS TemplateList
		LEFT JOIN EmployeeProject ON EmployeeProject.EmployeeID = TemplateList.EmployeeID
		LEFT JOIN Project ON Project.ProjectID = EmployeeProject.ProjectID
		LEFT JOIN ProjectWorkCode ON ProjectWorkCode.ProjectID = EmployeeProject.ProjectID AND ProjectWorkCode.EmployeeID = EmployeeProject.EmployeeID
	WHERE TemplateList.TemplateID = @TemplateID

	DELETE TOP(1) FROM @TemplateList
END



COMMIT TRANSACTION
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO
-- This statement writes to the SQL Server Log so SQL Monitor can show this deployment.
DECLARE @Success AS BIT
SET @Success = 1
SET NOEXEC OFF
IF (@Success = 1) PRINT 'The database update succeeded'
ELSE BEGIN
	IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION
	PRINT 'The database update failed'
END
GO