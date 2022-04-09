import {
  sendResponse,
  parseDayComments,
  getTrimmedTemplateRows,
  getFilteredTemplateRows,
} from "../../services/utils";
import { HttpException } from "../../services/error";
import {
  createTimeSheetTemplate,
  readTemplateEntries,
  clearTimesheet,
  updateTimeSheetTemplate,
  deleteTimeSheetTemplate,
  createBulkRowEntries,
  readTimesheetRow,
} from "../../database/timesheetDB";
import { readEmployeeWorkCodes } from "../../database/employeeDB";
import { Request, Response } from "express";
import { Controller, TimeEntryRow } from "../../services/types";

export const createTemplateController: Controller = async (
  req: Request,
  res: Response
) => {
  const result = await createTimeSheetTemplate(req.body);
  if (!result.success) {
    throw new HttpException(
      result.status,
      `Couldnt create time sheet template. ${result.message}`
    );
  } else {
    sendResponse(res, result);
  }
};

type UpdateTemplateParams = {
  templateid: number;
};
type UpdateTemplateBody = {
  Entries: TimeEntryRow[];
  EmployeeID: number;
};

export const updateTemplateController: Controller = async (
  req: Request<UpdateTemplateParams, unknown, UpdateTemplateBody, unknown>,
  res: Response
) => {
  const result = await updateTimeSheetTemplate(
    req.params.templateid,
    req.body.Entries,
    req.body.EmployeeID
  );
  if (!result.success) {
    throw new HttpException(
      result.status,
      `Couldnt update time sheet template. ${result.message}`
    );
  } else {
    sendResponse(res, result);
  }
};

type DeleteTemplateParams = {
  templateid: number;
};

export const deleteTemplateController: Controller = async (
  req: Request<DeleteTemplateParams, unknown, unknown, unknown>,
  res: Response
) => {
  const result = await deleteTimeSheetTemplate(req.params.templateid);
  if (!result.success) {
    throw new HttpException(
      result.status,
      `Couldnt delete time sheet template. ${result.message}`
    );
  } else {
    sendResponse(res, result);
  }
};

type LoadTemplateParams = {
  templateid: number;
};
type LoadTemplateBody = {
  startDate: Date;
  EmployeeID: number;
  overwrite: boolean;
};

export const loadTemplateController: Controller = async (
  req: Request<LoadTemplateParams, unknown, LoadTemplateBody, unknown>,
  res: Response
) => {
  if (req.body.overwrite) {
    const result1 = await clearTimesheet(
      req.body.EmployeeID,
      req.body.startDate
    );

    if (!result1.success) {
      throw new HttpException(
        result1.status,
        `Error loading sheet templates. ${result1.message}`
      );
    } else {
      const templateResult = await readTemplateEntries(
        req.params.templateid,
        req.body.startDate,
        req.body.EmployeeID
      );
      const userWorkCodes = await readEmployeeWorkCodes(req.body.EmployeeID);
      const filteredRows = getFilteredTemplateRows(
        templateResult.data,
        userWorkCodes.data
      ); //Filter only the template rows the user is allowed ie workcodes
      if (!templateResult.success) {
        throw new HttpException(
          templateResult.status,
          `Error loading templates. ${templateResult.message}`
        );
      } else {
        const result3 = await createBulkRowEntries(
          filteredRows,
          req.body.startDate,
          req.body.EmployeeID
        );
        if (!result3.success) {
          throw new HttpException(
            result3.status,
            `Error loading templates. ${result3.message}`
          );
        } else {
          sendResponse(res, result3);
        }
      }
    }
  } else {
    const templateResult = await readTemplateEntries(
      req.params.templateid,
      req.body.startDate,
      req.body.EmployeeID
    );
    const userWorkCodes = await readEmployeeWorkCodes(req.body.EmployeeID);
    const filteredRows = getFilteredTemplateRows(
      templateResult.data,
      userWorkCodes.data
    ); //Filter only the template rows the user is allowed ie workcodes

    if (!templateResult.success) {
      throw new HttpException(
        templateResult.status,
        `Error loading templates. ${templateResult.message}`
      );
    } else {
      const rows = await readTimesheetRow(
        req.body.EmployeeID,
        req.body.startDate
      );
      if (!rows.success) {
        throw new HttpException(
          rows.status,
          `Error loading templates. ${rows.message}`
        );
      } else {
        const trimmedRows = getTrimmedTemplateRows(rows.data, filteredRows); //remove rows that already exist
        if (trimmedRows.length === 0) {
          sendResponse(res, {
            data: [],
            status: 200,
            success: true,
            message: "",
          });
        } else {
          const result3 = await createBulkRowEntries(
            trimmedRows,
            req.body.startDate,
            req.body.EmployeeID
          );
          if (!result3.success) {
            throw new HttpException(
              result3.status,
              `Error loading templates. ${result3.message}`
            );
          } else {
            sendResponse(res, result3);
          }
        }
      }
    }
  }
};
