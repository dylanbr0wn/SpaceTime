import { sendResponse } from "../../services/utils";
import { HttpException } from "../../services/error";
import { lockTimesheet, unlockTimesheet } from "../../database/timesheetDB";
import { readTimeSheetPeriodLoggedTime } from "../../database/employeeDB";
import { Request, Response } from "express";
import { Controller } from "../../services/types";

type ReadManagerSubordinatesParams = {
  id: number;
};
type ReadManagerSubordinatesQuery = {
  startDate: Date;
};

export const readManagerSubordinatesController: Controller = async (
  req: Request<
    ReadManagerSubordinatesParams,
    unknown,
    unknown,
    ReadManagerSubordinatesQuery
  >,
  res: Response
) => {
  const result = await readTimeSheetPeriodLoggedTime(
    req.params.id,
    req.query.startDate
  );
  if (!result.success) {
    throw new HttpException(
      result.status,
      `Couldnt get manager info. ${result.message}`
    );
  } else {
    sendResponse(res, result);
  }
};
type LockEmployeeTimesheetParams = {
  id: number;
  subordinateid: number;
};
export const lockEmployeeTimesheetController: Controller = async (
  req: Request<LockEmployeeTimesheetParams, unknown, unknown, unknown>,
  res: Response
) => {
  const result = await lockTimesheet(req.params.id, req.params.subordinateid);
  if (!result.success) {
    throw new HttpException(
      result.status,
      `Couldnt lock timesheet. ${result.message}`
    );
  } else {
    sendResponse(res, result);
  }
};

type UnlockEmployeeTimesheetParams = {
  subordinateid: number;
};
export const unlockEmployeeTimesheetController: Controller = async (
  req: Request<UnlockEmployeeTimesheetParams, unknown, unknown, unknown>,
  res: Response
) => {
  const result = await unlockTimesheet(req.params.subordinateid);
  if (!result.success) {
    throw new HttpException(
      result.status,
      `Couldnt unlock timesheet. ${result.message}`
    );
  } else {
    sendResponse(res, result);
  }
};
