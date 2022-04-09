// Default user object
export const defaultEmployee = {
    Username: "",
    UserID: "",
    DepartmentID: -1,
    DeptName: "",
    DiamondEmpID: "",
    Email: "",
    EmployeeID: null,
    FirstName: "",
    IsActive: true,
    IsAdministrator: false,
    IsPayrollClerk: false,
    IsSupervisor: false,
    LastName: "",
    SAMAccountName: null,
    SupervisorID: -1,
};

export const defaultDepartment = {
    DepartmentID: null,
    DeptName: "",
    IsActive: false,
};

export const defaultProject = {
    ProjectID: null,
    DepartmentID: -1,
    Name: "",
    Description: "",
    IsActive: false,
    GLCode: null,
    DeptCode: "",
};

export const defaultWorkCode = {
    WorkCodeID: null,
    Code: "",
    Description: "",
    Multiplier: null,
    IsDefault: false,
    ExportToDynamics: false,
};

export const defaultWork = {
    WorkCodeID: -1,
    ProjectID: -1,
    EmployeeID: null,
    HoursWorked: null,
    DateofWork: "",
    Comment: null,
};
