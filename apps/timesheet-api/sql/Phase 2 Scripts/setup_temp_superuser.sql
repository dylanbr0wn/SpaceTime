-- Creates a super user for initial Account creation.
INSERT INTO [dbo].[UserLogin]
    ([EmployeeID], [Username], [Password])
VALUES
    ( 783, 'superuser', 'SuperUserLangford2020');

-- Gives admin privileges to a Employee with the EmployeeID.
UPDATE [dbo].[Employee]
SET IsAdministrator = 1, IsSupervisor = 1, IsPayrollClerk = 1
WHERE EmployeeID = 783;