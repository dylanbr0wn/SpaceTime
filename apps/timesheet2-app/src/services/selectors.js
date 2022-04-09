import { createSelector } from "@reduxjs/toolkit";
import { getTimesheetApprovalStatus } from "./utils";

const getSubordinates = state => state.subordinates.employeeInfo;
const getSupervisorID = state => state.currentUser.user.EmployeeID;
const getProjects = state => state.projects;
const getWorkCodes = state => state.workCodes;
const getUserWorkCodes = (_, props) => props.workCodes;
const getRowProjectID = (_, props) => props.row.original.ProjectID;
// const getRowWorkCodeID = (_, props) => props.row.original.WorkCodeID;
const getRowDepartmentID = (_, props) => props.row.original.DepartmentID;
const getData = (_, props) => props.data;
const getEmployees = state => state.employees;
const getDepartments = state => state.departments;

export const getSupervisors = createSelector([getEmployees], employees => {
    return employees.filter(
        employee => employee.IsSupervisor && employee.IsActive
    );
});

export const createValidProjectsSelector = () => {
    return createSelector(
        [getProjects, getRowDepartmentID],
        (projects, DepartmentID) => {
            return (
                projects
                    // .filter(project => project.IsActive)
                    .filter(project => project.DepartmentID === DepartmentID)
            );
        }
    );
};

export const getActiveDepartments = createSelector(
    [getDepartments],
    departments => {
        return departments.filter(dep => dep.IsActive);
    }
);

export const getValidProjects = createSelector(
    [getProjects, getRowDepartmentID],
    (projects, DepartmentID) => {
        return projects
            .filter(project => project.IsActive)
            .filter(project => project.DepartmentID === DepartmentID);
    }
);
export const getComputedData = createSelector([getData], data => {
    return data.map(row => ({
        ProjectID: row.ProjectID,
        WorkCodeID: row.WorkCodeID,
    }));
});

export const createUnusedWorkCodesSelector = () => {
    return createSelector(
        [getWorkCodes, getUserWorkCodes, getComputedData, getRowProjectID],
        (workCodes, userWorkCodes, data, ProjectID) => {
            const used = data
                .filter(
                    dataRow =>
                        dataRow.WorkCodeID > 0 &&
                        dataRow.ProjectID === ProjectID
                )
                .map(dataRow => dataRow.WorkCodeID);
            return workCodes.filter(
                workCode =>
                    !userWorkCodes
                        .map(workCode => workCode.WorkCodeID)
                        .includes(workCode.WorkCodeID) &&
                    !used.includes(workCode.WorkCodeID)
            );
        }
    );
};

export const createAllowedWorkCodesSelector = () => {
    return createSelector(
        [getRowProjectID, getUserWorkCodes, getComputedData],
        (ProjectID, userWorkCodes, data) => {
            const used = data
                .filter(
                    dataRow =>
                        dataRow.WorkCodeID > 0 &&
                        dataRow.ProjectID === ProjectID
                )
                .map(dataRow => dataRow.WorkCodeID);

            return userWorkCodes.filter(
                code => !used.includes(code.WorkCodeID)
            );
        }
    );
    // return createSelector(
    //     [getUserWorkCodes, _getFilteredData],
    //     (userWorkCodes, data) => {
    //         // console.log("run");
    //         return userWorkCodes.filter(
    //             code => !data.includes(code.WorkCodeID)
    //         );
    //     }
    // );
};

export const getPayrollSubordinates = createSelector(
    [getSubordinates, getDepartments],
    (subordinates, departments) => {
        return subordinates
            .filter(sub => sub.user.IsActive)
            .map(sub => {
                const Dept = departments.find(
                    dep => sub.user.DepartmentID === dep.DepartmentID
                );
                return {
                    ...sub.user,
                    TimesheetStatus: getTimesheetApprovalStatus(
                        sub.user.ApprovalStatus,
                        sub.user.SubmitCount > 0,
                        sub.user.ApprovalID
                    ),
                    DeptName: Dept ? Dept.DeptName : "",
                    Total: sub.user["Total"] || 0,
                    ActiveStatus: sub.user["IsActive"] ? "Active" : "Inactive",
                };
            });
    }
);
export const getManagerSubordinates = createSelector(
    [getSubordinates, getSupervisorID, getDepartments],
    (subordinates, supervisorID, departments) => {
        return subordinates
            .filter(
                sub =>
                    sub.user.SupervisorID === supervisorID && sub.user.IsActive
            )
            .map(sub => {
                const Dept = departments.find(
                    dep => sub.user.DepartmentID === dep.DepartmentID
                );
                return {
                    ...sub.user,
                    TimesheetStatus: getTimesheetApprovalStatus(
                        sub.user.ApprovalStatus,
                        sub.user.SubmitCount > 0,
                        sub.user.ApprovalID
                    ),
                    DeptName: Dept ? Dept.DeptName : "",

                    Total: sub.user["Total"] || 0,
                    ActiveStatus: sub.user["IsActive"] ? "Active" : "Inactive",
                };
            });
    }
);
