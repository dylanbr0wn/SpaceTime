import {
  checkEmployeeRoutes,
  EntryRowSorter,
  parseTimeSheetRows,
  sendResponse,
} from "../../services/utils";
import { HttpException } from "../../services/error";
import {
  updateTimeEntries,
  deleteTimeEntries,
  createTimesheetSubmission,
  createTimesheetRow,
  readTimesheetRow,
  updateTimesheetRow,
  deleteTimesheetRow,
  readTimesheetEmployeeApprovals,
  readEmployeeApproval,
  readEmployeeSubmittedSheets,
  deleteTimesheetRows,
} from "../../database/timesheetDB";
import {
  readEmployeeTimeEntries,
  readEmployeeTimeEntryComments,
} from "../../database/employeeDB";
import {
  createApproval,
  updateApprovalEmployee,
} from "../../database/approvalDB";
import { sendSubmitNotifactionEmailToSupervisor } from "../../services/email";
import { DatabaseResponse } from "../../../config/database";
import { Request, Response } from "express";
import { Controller, TimeEntry, TimeEntryRow } from "../../services/types";

type GetPayrollSubordinateQuery = {
  startDate: Date;
};

export const getPayrollSubordinateController: Controller = async (
  req: Request<unknown, unknown, unknown, GetPayrollSubordinateQuery>,
  res: Response
) => {
  const result = await readTimesheetEmployeeApprovals(req.query.startDate);
  if (!result.success) {
    throw new HttpException(
      result.status,
      `Couldnt get manager info. ${result.message}`
    );
  } else {
    sendResponse(res, result);
  }
};

export const createRowController: Controller = async (
  req: Request,
  res: Response
) => {
  const result = await createTimesheetRow(req.body);
  if (!result.success) {
    throw new HttpException(
      result.status,
      `Couldnt create row. ${result.message}`
    );
  } else {
    sendResponse(res, result);
  }
};

export const updateRowController = async (req: Request, res: Response) => {
  const row = await updateTimesheetRow(req.body);
  if (req.body.ProjectID !== -1 && req.body.WorkCodeID !== -1) {
    // Prevents updating the timeentries with intermediate values while switching departments
    const result = await updateTimeEntries(req.body);
    if (!result.success) {
      throw new HttpException(
        result.status,
        `Couldnt update time entries. ${result.message}`
      );
    }
  }
  sendResponse(res, row);
};

type DeleteUnusedRowsParams = {
  id: number;
};
type DeleteUnusedRowsQuery = {
  startDate: Date;
};

export const deleteUnusedRowsController: Controller = async (
  req: Request<DeleteUnusedRowsParams, unknown, unknown, DeleteUnusedRowsQuery>,
  res: Response
) => {
  const timesheetRows = await readTimesheetRow(
    //get rows
    req.params.id,
    req.query.startDate
  );
  if (!timesheetRows.success) {
    throw new HttpException(
      timesheetRows.status,
      `Couldnt delete time entries. ${timesheetRows.message}`
    );
  }
  const timesheetEntries = await readEmployeeTimeEntries(
    //get entries
    req.params.id,
    req.query.startDate
  );

  if (!timesheetEntries.success) {
    throw new HttpException(
      timesheetEntries.status,
      `Couldnt delete time entries. ${timesheetEntries.message}`
    );
  }

  const entries = [
    // create unique list of used entries
    ...new Set<string>(
      timesheetEntries.data.map(
        (entry: TimeEntry) => `${entry.ProjectID},${entry.WorkCodeID}`
      )
    ),
  ];

  const unusedTimesheetRows: TimeEntryRow[] = timesheetRows.data.filter(
    (row: TimeEntryRow) => {
      //filter rows that have valid entries
      const rowCode = `${row.ProjectID},${row.WorkCodeID}`;

      return !entries.includes(rowCode);
    }
  );

  if (unusedTimesheetRows.length !== 0) {
    const result = await deleteTimesheetRows(
      parseTimeSheetRows(unusedTimesheetRows)
    );
    if (!result.success) {
      throw new HttpException(
        result.status,
        `Couldnt delete time entries. ${result.message}`
      );
    } else {
      sendResponse(res, result);
    }
  } else {
    sendResponse(res, {
      success: true,
      data: "",
      message: "",
      status: 204,
    });
  }
};

export const deleteRowController: Controller = async (
  req: Request,
  res: Response
) => {
  await deleteTimesheetRow(req.body);
  const result = await deleteTimeEntries(req.body);
  if (!result.success) {
    throw new HttpException(
      result.status,
      `Couldnt delete time entries. ${result.message}`
    );
  } else {
    sendResponse(res, result);
  }
};

type SubmitTimesheetQuery = {
  startDate: Date;
};
type SubmitTimesheetBody = {
  employeeID: number;
  ApprovalID: number | null;
  lastDay: Date;
};

export const submitTimesheetController: Controller = async (
  req: Request<unknown, unknown, SubmitTimesheetBody, SubmitTimesheetQuery>,
  res: Response
) => {
  let result2: DatabaseResponse;

  const timesheet = await readEmployeeTimeEntries(
    //get entries
    req.body.employeeID,
    req.query.startDate
  );
  if (!timesheet.success)
    throw new HttpException(
      timesheet.status,
      `Couldnt create timesheet submission. ${timesheet.message}`
    );

  const result = await createTimesheetSubmission(req.body, timesheet.data);
  if (!result.success)
    throw new HttpException(
      result.status,
      `Couldnt create timesheet submission. ${result.message}`
    );
  if (req.body.ApprovalID) {
    result2 = await updateApprovalEmployee({
      ApprovalStatus: null,
      ApprovalID: req.body.ApprovalID,
    });
    if (!result2.success)
      throw new HttpException(
        result2.status,
        `Couldnt update timesheet approval. ${result2.message}`
      );
  } else {
    let approval = await readEmployeeApproval(
      req.query.startDate,
      req.body.employeeID
    );
    if (!approval.success)
      throw new HttpException(
        approval.status,
        `Couldnt create timesheet approval. ${approval.message}`
      );
    if (approval.data) {
      result2 = await updateApprovalEmployee({
        ApprovalStatus: null,
        ApprovalID: approval.data.ApprovalID,
      });
      if (!result2.success)
        throw new HttpException(
          result2.status,
          `Couldnt update timesheet approval. ${result2.message}`
        );
    } else {
      result2 = await createApproval({
        SubmissionID: result.data.SubmissionID,
      });
      if (!result2.success)
        throw new HttpException(
          result2.status,
          `Couldnt create timesheet approval. ${result2.message}`
        );
    }
  }
  // If user is submitting for themself, notify, if not skip
  if (req.body.employeeID === (req.user?.EmployeeID ?? -1)) {
    sendSubmitNotifactionEmailToSupervisor(
      req.body.employeeID,
      timesheet.data,
      req.query.startDate
    );
  }

  sendResponse(res, { ...result, ...result2 });
};

type ReadEmployeeTimesheetParams = {
  id: number;
};
type ReadEmployeeTimesheetQuery = {
  startDate: Date;
};

export const readEmployeeTimesheetController: Controller = async (
  req: Request<
    ReadEmployeeTimesheetParams,
    unknown,
    unknown,
    ReadEmployeeTimesheetQuery
  >,
  res: Response
) => {
  //check lock
  if (req.params.id === (req.user?.EmployeeID ?? -1))
    await checkEmployeeRoutes(req.user?.EmployeeID ?? -1);
  const rows = await readTimesheetRow(req.params.id, req.query.startDate);
  if (!rows.success)
    throw new HttpException(
      rows.status,
      `Error getting employee timesheet rows. ${rows.message}`
    );
  const entries = await readEmployeeTimeEntries(
    req.params.id,
    req.query.startDate
  );
  if (!entries.success)
    throw new HttpException(
      entries.status,
      `Error getting employee time entries. ${entries.message}`
    );
  let sortedEntries = EntryRowSorter(
    rows.data,
    entries.data,
    req.query.startDate,
    req.params.id
  );
  const comments = await readEmployeeTimeEntryComments(
    req.params.id,
    req.query.startDate
  );
  if (!comments.success)
    throw new HttpException(
      comments.status,
      `Error getting employee time entry comments. ${comments.message}`
    );
  const approval = await readEmployeeApproval(
    req.query.startDate,
    req.params.id
  );
  if (!approval.success)
    throw new HttpException(
      approval.status,
      `Error getting employee approvals. ${approval.message}`
    );
  const submitCount = await readEmployeeSubmittedSheets(
    req.query.startDate,
    req.params.id
  );
  if (!submitCount.success)
    throw new HttpException(
      submitCount.status,
      `Error getting employee submission. ${submitCount.message}`
    );

  sendResponse(res, {
    ...comments,
    data: {
      comments: comments.data,
      entries: sortedEntries,
      approval: approval.data,
      submitCount: submitCount.data,
    },
  });
};
