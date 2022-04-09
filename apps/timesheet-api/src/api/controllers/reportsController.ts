import {
  dynamicsExport,
  employeeTimeSheet,
  tardyEmployeeTimeSheet,
  employeeTimesheetPrint,
} from "../database/reportDB";
import { parseCSV, sendResponse } from "../services/utils";
import { HttpException } from "../services/error";
import ejs from "ejs";
import pdf, { CreateOptions } from "html-pdf";
import path from "path";
import { readEmployeeApproval } from "../database/timesheetDB";
import {
  readEmployee,
  readEmployeeTimeEntryComments,
} from "../database/employeeDB";
import moment from "moment";
import { Request, Response } from "express";
import { Controller, DayComment, TimeEntry } from "../services/types";

type DynamicsReportQuery = {
  startDate: Date;
  endDate: Date;
};

export const dynamicsReportController: Controller = async (
  req: Request<unknown, unknown, unknown, DynamicsReportQuery>,
  res: Response
) => {
  const result = await dynamicsExport(req.query.startDate, req.query.endDate);
  if (!result.success) {
    throw new HttpException(
      result.status,
      `Couldnt get dynamics data. ${result.message}`
    );
  } else {
    const csv = parseCSV(result.data);
    res.contentType("text/csv");
    res.set("Content-Disposition", `attachment; filename=dynamics_report.csv`);
    sendResponse(res, { status: 200, data: csv, success: true, message: "" });
  }
};

type TardyEmployeeReportQuery = {
  startDate: Date;
};

export const tardyEmployeeReportController: Controller = async (
  req: Request<unknown, unknown, unknown, TardyEmployeeReportQuery>,
  res: Response
) => {
  const result = await tardyEmployeeTimeSheet(req.query.startDate);
  if (!result.data) {
    throw new HttpException(
      result.status,
      `Couldnt get tardy employee report data. ${result.message}`
    );
  } else {
    sendResponse(res, result);
  }
};

type EmployeeTimesheetReportQuery = {
  employeeID: number;
  startDate: Date;
  endDate: Date;
};

export const employeeTimesheetReportController: Controller = async (
  req: Request<unknown, unknown, unknown, EmployeeTimesheetReportQuery>,
  res: Response
) => {
  const result = await employeeTimeSheet(
    req.query.employeeID,
    req.query.startDate,
    req.query.endDate
  );
  if (!result.success) {
    throw new HttpException(
      result.status,
      `Couldnt get employee timesheet report data. ${result.message}`
    );
  } else {
    const csv = parseCSV(result.data);

    res.contentType("text/csv");
    res.set(
      "Content-Disposition",
      `attachment; filename=${req.query.employeeID}_report.csv`
    );
    sendResponse(res, { status: 200, data: csv, success: true, message: "" });
  }
};

type PayrollPeriodReportQuery = {
  employeeID: number;
  startDate: Date;
  endDate: Date;
};

export const payrollPeriodReportController: Controller = async (
  req: Request<unknown, unknown, unknown, PayrollPeriodReportQuery>,
  res: Response
) => {
  const employee = await readEmployee(req.query.employeeID);
  const approval = await readEmployeeApproval(
    req.query.startDate,
    req.query.employeeID
  );

  let startDate = moment.utc(req.query.startDate);
  let endDate = moment.utc(req.query.startDate).add(13, "d");

  const timesheet = await employeeTimesheetPrint(
    req.query.employeeID,
    startDate.toDate(),
    endDate.toDate()
  );

  const getApprovalStatus = (approvalStatus: number | null) => {
    if (approvalStatus === null) return "Not approved";
    else if (approvalStatus === 0) return "Rejected";
    else if (approvalStatus === 1) return "Supervisor Approved";
    else if (approvalStatus === 2) return "Payroll Approved";
  };

  let approvalData = approval.data
    ? {
        ...approval.data,
        ApprovalStatus: getApprovalStatus(approval.data.ApprovalStatus),
      }
    : null;

  let timesheetData = timesheet.data.map((entry: TimeEntry) => ({
    ...entry,
    DateofWork: moment.utc(entry.DateofWork).format("L"),
  }));

  let totalHours = timesheet.data.reduce(
    (accumulator: number, currentValue: { HoursWorked: string }) =>
      accumulator + parseFloat(currentValue.HoursWorked),
    0
  );

  let dayComments = await readEmployeeTimeEntryComments(
    req.query.employeeID,
    req.query.startDate
  );
  dayComments = dayComments.data
    .filter((comment: DayComment) => comment.DayCommentID)
    .map((comment: DayComment) => {
      return {
        ...comment,
        DateofComment: moment.utc(comment.DateofComment).format("L"),
      };
    });

  ejs.renderFile(
    path.join(__dirname, "../templates/", "timesheetReport.ejs"),
    {
      approval: approvalData,
      employee: employee.data,
      startDate: startDate.format("L"),
      endDate: endDate.format("L"),
      timesheet: timesheetData,
      totalHours,
      dayComments,
    },
    (err, data) => {
      if (err) {
        throw new HttpException(500, err.message);
      } else {
        let options: CreateOptions = {
          height: "11.25in",
          width: "8.5in",
          header: {
            height: "20mm",
          },
          footer: {
            height: "20mm",
          },
          type: "pdf",
        };
        pdf.create(data, options).toStream((err, stream) => {
          if (err) {
            throw new HttpException(500, err.message);
          } else {
            // res.contentType('application/octet-stream');
            // res.set('Content-Disposition', `attachment; filename=test.pdf`);
            stream.on("end", () => {
              // done reading
              return res.end();
            });

            stream.pipe(res);
          }
        });
      }
    }
  );
};

type EmployeeCommentsReportQuery = {
  employeeID: number;
  startDate: Date;
  endDate: Date;
};

export const employeeCommentsReportController: Controller = async (
  req: Request<unknown, unknown, unknown, EmployeeCommentsReportQuery>,
  res: Response
) => {
  const employee = await readEmployee(req.query.employeeID);
  const approval = await readEmployeeApproval(
    req.query.startDate,
    req.query.employeeID
  );

  let startDate = moment.utc(req.query.startDate);
  let endDate = moment.utc(req.query.startDate).add(13, "d");

  const timesheet = await employeeTimesheetPrint(
    req.query.employeeID,
    startDate.toDate(),
    endDate.toDate()
  );

  const getApprovalStatus = (approvalStatus: number | number) => {
    if (approvalStatus === null) return "Not approved";
    else if (approvalStatus === 0) return "Rejected";
    else if (approvalStatus === 1) return "Supervisor Approved";
    else if (approvalStatus === 2) return "Payroll Approved";
  };

  let approvalData = approval.data
    ? {
        ...approval.data,
        ApprovalStatus: getApprovalStatus(approval.data.ApprovalStatus),
      }
    : null;

  let timesheetData = timesheet.data
    .filter((entry: TimeEntry) => entry.Comment)
    .map((entry: TimeEntry) => ({
      Comment: entry.Comment,
      DateofWork: moment.utc(entry.DateofWork).format("L"),
    }));

  let dayComments = await readEmployeeTimeEntryComments(
    req.query.employeeID,
    req.query.startDate
  );
  dayComments = dayComments.data
    .filter((comment: DayComment) => comment.DayCommentID)
    .map((comment: DayComment) => {
      return {
        ...comment,
        DateofComment: moment.utc(comment.DateofComment).format("L"),
      };
    });

  ejs.renderFile(
    path.join(__dirname, "../templates/", "commentsReport.ejs"),
    {
      approval: approvalData,
      employee: employee.data,
      startDate: startDate.format("L"),
      endDate: endDate.format("L"),
      timesheet: timesheetData,
      dayComments,
    },
    (err, data) => {
      if (err) {
        throw new HttpException(500, err.message);
      } else {
        let options: CreateOptions = {
          height: "11.25in",
          width: "8.5in",
          header: {
            height: "20mm",
          },
          footer: {
            height: "20mm",
          },
          type: "pdf",
        };
        pdf.create(data, options).toStream((err, stream) => {
          if (err) {
            throw new HttpException(500, err.message);
          } else {
            // res.contentType('application/octet-stream');
            // res.set('Content-Disposition', `attachment; filename=test.pdf`);
            stream.on("end", () => {
              // done reading
              return res.end();
            });

            stream.pipe(res);
          }
        });
      }
    }
  );
};
