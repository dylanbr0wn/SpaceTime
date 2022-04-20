import Holidays from "date-holidays";
import { DateTime } from "luxon";
import moment from "moment";

export const getTimesheetApprovalStatus = (
    ApprovalStatus,
    Submitted,
    ApprovalID
) => {
    if (ApprovalID) {
        if (ApprovalStatus === null) {
            if (Submitted) {
                return {
                    status: "Submitted",
                    color: "text-warning",
                    info: "Timesheet is submitted. Awaiting manager approval.",
                };
            } else {
                return {
                    status: "Not Submitted",
                    color: "",
                    info: "Timesheet has not been submitted. Please submit your timesheet!",
                };
            }
        }
        if (ApprovalStatus === 0) {
            return {
                status: "Rejected",
                color: "text-danger",
                info: "Timesheet has been rejected by a manager. Please fix it and resubmit",
            };
        }
        if (ApprovalStatus === 1) {
            return {
                status: "Manager Approved",
                color: "text-success",
                info: "Timesheet is approved by your manager. Awaiting payroll approval",
            };
        }
        if (ApprovalStatus === 2) {
            return {
                status: "Payroll Approved",
                color: "text-info",
                info: "Timesheet is approved by payroll clerk. Timesheet is complete.",
            };
        }
    } else {
        if (Submitted) {
            return {
                status: "Submitted(Old)",
                color: "text-warning",
                info: "Timesheet has been submitted on the old system. It will need to be resubmitted for approval.",
            };
        } else {
            return {
                status: "Not Submitted",
                color: "",
                info: "Timesheet has not been submitted. Please submit your timesheet!",
            };
        }
    }
};

export const submitSanityChecks = (
    timesheet,
    totalHours,
    workDays,
    checkExpectedHours = true,
    expectedHours = 70,
    departments,
    projects
) => {
    let errors = {};

    errors = expectedHoursCheck(
        checkExpectedHours,
        totalHours,
        expectedHours,
        errors
    );

    errors = statPayCheck(timesheet, errors, workDays);
    errors = invalidRowCheck(timesheet, errors, departments, projects);
    return errors;
};

const hd = new Holidays();

hd.init("CA", "BC", {
    timezone: "GMT", //all times in GMT
    types: ["public", "bank", "school"], //all types of holidays
});
hd.setHoliday("easter 1", { name: "Easter Monday", type: "public" }); //Add easter monday

//Add any other holidays here

export const getDayFeatures = (day: DateTime) => {
    const dateType = {
        isWeekEnd: day.weekday === 6 || day.weekday === 7,
        isHoliday: hd.isHoliday(day.toISO()),
        isToday: day.hasSame(DateTime.local(), "day"),
    };

    const hoverText = `${day.toFormat("yyyy/LL/dd")} ${
        dateType.isHoliday
            ? `(${dateType.isHoliday[0].name})`
            : dateType.isWeekEnd
            ? "(Weekend)"
            : ""
    }${dateType.isToday ? `- Today` : ""}`;

    const style = dateType.isToday
        ? "text-yellow-500"
        : dateType.isHoliday || dateType.isWeekEnd
        ? "text-slate-500"
        : "text-sky-300";

    return { style, hoverText, dateType };
};

const invalidRowCheck = (timesheet, errors, departments, projects) => {
    let invalidRow = false;
    timesheet.forEach((row) => {
        if (row.WorkCodeID !== 62) {
            if (
                row.DepartmentID === -1 ||
                row.WorkCodeID === -1 ||
                row.ProjectID === -1
            ) {
                row.dates.forEach((day) => {
                    if (day.TimeEntryID) {
                        invalidRow = true;
                    }
                });
            }

            const Department = departments
                .filter((wc) => wc.IsActive)
                .find((dep) => dep.DepartmentID === row.DepartmentID);
            if (!Department) {
                invalidRow = true;
            }

            const Project = projects
                .filter((wc) => wc.IsActive)
                .find((proj) => proj.ProjectID === row.ProjectID);

            if (!Project) invalidRow = true;
        }
    });
    if (invalidRow) {
        errors.invalidRow =
            "One of the rows you have entered time on is incomplete and should be completed before submission.";
    }
    return errors;
};

const statPayCheck = (timesheet, errors, workDays) => {
    const statCodes = [29, 30, 32, 59, 60, 61];
    const { parsedWork } = getDayFeatures(workDays);
    timesheet.forEach(({ dates }) => {
        dates.forEach((day, i) => {
            let isHoliday = parsedWork[i].isHoliday;
            let worked = isNaN(parseFloat(day.HoursWorked))
                ? false
                : parseFloat(day.HoursWorked) > 0;
            let hasStatCode = statCodes.includes(day.WorkCodeID);
            if (isHoliday && worked && !hasStatCode) {
                errors.workedAStat = `Hours have been entered on a stat holiday: ${
                    isHoliday.name
                } (${moment
                    .utc(day.DateofWork)
                    .format("L")}) without a stat pay work code.`;
            }
        });
    });
    return errors;
};

const expectedHoursCheck = (
    checkExpectedHours,
    totalHours,
    expectedHours,
    errors
) => {
    if (!checkExpectedHours.EmployeePreferenceID) {
        if (parseFloat(totalHours) !== expectedHours)
            errors.expectedHours = `The total hours recorded do not match your expected number of hours.`;
    }
    if (checkExpectedHours.Value && parseFloat(totalHours) !== expectedHours) {
        errors.expectedHours = `The total hours recorded do not match your expected number of hours.`;
    }
    return errors;
};

export const checkValidProject = (
    ProjectID,
    data,
    workCodes,
    WorkCodeID,
    type
) => {
    if (!data.map((row) => row.ProjectID).includes(ProjectID)) return false; //If first time using project then there wont be an issue so skip rest

    const usedWorkCodes = data
        .filter((row) => row.ProjectID === ProjectID)
        .map((row) => row.WorkCodeID)
        .filter((row) => row.WorkCodeID !== -1);
    if (type === "user") {
        //admins should be able to add as many as they like
        if (usedWorkCodes.length === workCodes.length) return true; //If we have use all workcodes for the project
    }

    if (WorkCodeID !== -1 && usedWorkCodes.includes(WorkCodeID)) return true; //IF remaining workcodes used for this project include the one we are currently have then stop it

    return false;
};

export const getPinnedRows = (rowsToPin, rows) => {
    let pinnedRows = [];
    let otherRows = [];

    let parsedRowsToPin = rowsToPin.map((row) => ({
        ProjectID: row.ProjectID,
        DepartmentID: row.DepartmentID,
        WorkCodeID: row.WorkCodeID,
    }));

    rows.forEach((row) => {
        const rowDetails = {
            ProjectID: row.original.ProjectID,
            DepartmentID: row.original.DepartmentID,
            WorkCodeID: row.original.WorkCodeID,
        };

        let isPinnedMember = false;

        parsedRowsToPin.forEach((pin) => {
            if (isEquivalentObjects(pin, rowDetails)) isPinnedMember = true;
        });

        if (isPinnedMember) pinnedRows.push(row);
        else otherRows.push(row);
    });
    return [pinnedRows, otherRows];
};

//From A Drip of JavaScript http://adripofjavascript.com/blog/drips/object-equality-in-javascript.html
const isEquivalentObjects = (a, b) => {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];

        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
            return false;
        }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
};

const rowCompare = (row1, row2) => {
    if (row1.DeptName > row2.DeptName) return 1;
    if (row1.DeptName < row2.DeptName) return -1;
    if (row1.ProjName > row2.ProjName) return 1;
    if (row1.ProjName < row2.ProjName) return -1;
    if (row1.WCName > row2.WCName) return 1;
    if (row1.WCName < row2.WCName) return -1;
    console.log("this is what is known as an oopsie");
    return 0;
};

export const getSortedRows = ({ rows, departments, projects, workCodes }) => {
    return rows
        .map((row) => {
            let newRow = { ...row, DeptName: "", ProjName: "", WCName: "" };
            if (row.WorkCodeID !== -1) {
                const code = workCodes.find(
                    (code) => code.WorkCodeID === row.WorkCodeID
                );
                newRow.WCName = code ? code.Description : "";
            }
            if (row.ProjectID !== -1) {
                const proj = projects.find(
                    (proj) => proj.ProjectID === row.ProjectID
                );
                newRow.ProjName = proj ? proj.Name : "";
            }
            if (row.DepartmentID !== -1) {
                const dept = departments.find(
                    (dep) => dep.DepartmentID === row.DepartmentID
                );
                newRow.DeptName = dept ? dept.DeptName : "";
            }
            return newRow;
        })
        .sort(rowCompare)
        .map((row) => {
            delete row.DeptName;
            delete row.ProjName;
            delete row.WCName;
            return row;
        });
};
