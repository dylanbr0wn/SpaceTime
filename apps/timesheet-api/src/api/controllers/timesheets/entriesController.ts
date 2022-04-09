import { sendResponse } from "../../services/utils";
import { HttpException } from "../../services/error";
import {
  createTimeEntries,
  updateTimeEntry,
  deleteTimeEntry,
} from "../../database/timesheetDB";
import { Request, Response } from "express";
import { Controller } from "../../services/types";

export const createTimesheetEntryController: Controller = async (
  req: Request,
  res: Response
) => {
  const result = await createTimeEntries(req.body);
  if (!result.success) {
    throw new HttpException(
      result.status,
      `Couldnt create time entry. ${result.message}`
    );
  } else {
    sendResponse(res, result);
  }
};
export const updateTimesheetEntryController: Controller = async (
  req: Request,
  res: Response
) => {
  const result = await updateTimeEntry({
    ...req.body,
    TimeEntryID: req.params.entryid,
  });
  if (!result.success) {
    throw new HttpException(
      result.status,
      `Couldnt update time entry. ${result.message}`
    );
  } else {
    sendResponse(res, result);
  }
};

type DeleteTimesheetEntryParams = {
  entryid: number;
};

export const deleteTimesheetEntryController: Controller = async (
  req: Request<DeleteTimesheetEntryParams, unknown, unknown, unknown>,
  res: Response
) => {
  const result = await deleteTimeEntry(req.params.entryid);
  if (!result.success) {
    throw new HttpException(
      result.status,
      `Couldnt delete time entry. ${result.message}`
    );
  } else {
    sendResponse(res, result);
  }
};
