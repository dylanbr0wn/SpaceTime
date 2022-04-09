import { getParsedPrefs, sendResponse } from "../services/utils";
import { HttpException } from "../services/error";
import {
  readEmployeeFromEmail,
  readEmployeePinnedRows,
  readEmployeePreferences,
} from "../database/employeeDB";
import { Request, Response } from "express";
import { Controller } from "../services/types";

export const ADController: Controller = async (req: Request, res: Response) => {
  if (req.body.email) {
    let employee = await readEmployeeFromEmail(req.body.email);
    if (!employee.success) {
      throw new HttpException(
        employee.status,
        `Error getting employee. ${employee.message}`
      ); // SQL Error
    } else {
      let prefs = await readEmployeePreferences(employee.data.EmployeeID);

      if (!prefs.success) {
        throw new HttpException(
          prefs.status,
          `Error getting employee. ${prefs.message}`
        ); // SQL Error
      } else {
        let pinnedRows = await readEmployeePinnedRows(employee.data.EmployeeID);
        if (!pinnedRows.success) {
          throw new HttpException(
            pinnedRows.status,
            `Error getting employee. ${pinnedRows.message}`
          ); // SQL Error
        } else {
          const parsedPrefs = getParsedPrefs(prefs.data, pinnedRows.data);
          sendResponse(res, {
            status: 200,
            data: {
              employee: employee.data,
              preferences: parsedPrefs,
            },
            success: true,
            message: "",
          });
        }
      }
    }
  } else {
    throw new HttpException(404, `Must provide Email`);
  }
};
