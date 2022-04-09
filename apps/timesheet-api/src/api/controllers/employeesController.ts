import {
  readAllEmployees,
  updateEmployeeWorkCodes,
  updateEmployee,
  readEmployeeWorkCodes,
  readEmployee,
  createEmployee,
  readTimeSheetTemplate,
  readEmployeeFromEmail,
  createEmployeePreference,
  updateEmployeePreference,
  createEmployeePinnedRows,
  deleteEmployeePinnedRows,
} from "../database/employeeDB";
import {
  checkEmployeeRoutes,
  getParsedPref,
  sendResponse,
} from "../services/utils";
import { HttpException } from "../services/error";
import { Request, Response } from "express";
import { Controller, UserInfo, WorkCode } from "../services/types";

export const readEmployeesController: Controller = async (
  req: Request,
  res: Response
) => {
  const result = await readAllEmployees();
  if (!result.data) {
    throw new HttpException(
      result.status,
      `Couldnt get users. ${result.message}`
    );
  } else {
    sendResponse(res, result);
  }
};
export const createEmployeesController: Controller = async (
  req: Request,
  res: Response
) => {
  const result = await createEmployee(req.body.employee);
  if (!result.success) {
    throw new HttpException(
      result.status,
      `Error creating employee. ${result.message}`
    );
  } else if (req.body.workCodes.length === 0) {
    sendResponse(res, result);
  } else {
    const result2 = await updateEmployeeWorkCodes(
      result.data.EmployeeID,
      req.body.workCodes
    );
    if (!result2.success) {
      throw new HttpException(
        result2.status,
        `Error creating employee. ${result2.message}`
      );
    } else {
      sendResponse(res, result);
    }
  }
};

type ReadEmployeeParams = {
  id: number;
};

export const readEmployeeController: Controller = async (
  req: Request<ReadEmployeeParams, unknown, unknown, unknown>,
  res: Response
) => {
  const result = await readEmployee(req.params.id);
  if (!result.success) {
    throw new HttpException(
      result.status,
      `Error getting employee. ${result.message}`
    );
  } else {
    sendResponse(res, result);
  }
};

export const readEmployeeByEmailController: Controller = async (
  req: Request,
  res: Response
) => {
  const result = await readEmployeeFromEmail(req.body.email);
  if (!result.success) {
    throw new HttpException(
      result.status,
      `Error getting employee. ${result.message}`
    );
  } else {
    sendResponse(res, result);
  }
};

type ReadEmployeeTemplateParams = {
  id: number;
};

export const readEmployeeTemplatesController: Controller = async (
  req: Request<ReadEmployeeTemplateParams, unknown, unknown, unknown>,
  res: Response
) => {
  const EmployeeID = req.user?.EmployeeID ?? -1;
  if (req.params.id === EmployeeID) await checkEmployeeRoutes(EmployeeID);
  const result = await readTimeSheetTemplate(req.params.id);
  if (!result.success) {
    throw new HttpException(
      result.status,
      `Error getting employee time sheet templates. ${result.message}`
    );
  } else {
    sendResponse(res, result);
  }
};

type UpdateEmployeeParams = {
  id: number;
};

type UpdateEmployeeBody = {
  workCodes: WorkCode[];
  employee: UserInfo;
};

export const updateEmployeeController: Controller = async (
  req: Request<UpdateEmployeeParams, unknown, UpdateEmployeeBody, unknown>,
  res: Response
) => {
  const result = await updateEmployee(req.body.employee);

  if (!result.success) {
    throw new HttpException(
      result.status,
      `Error updating employee. ${result.message}`
    );
  } else if (req.body.workCodes.length === 0) {
    sendResponse(res, result);
  } else {
    const result2 = await updateEmployeeWorkCodes(
      req.params.id,
      req.body.workCodes
    );
    if (!result2.success) {
      throw new HttpException(
        result2.status,
        `Error updating employee. ${result2.message}`
      );
    } else {
      sendResponse(res, result);
    }
  }
};

type ReadEmployeeWorkCodesParams = {
  id: number;
};

export const readEmployeeWorkCodesController: Controller = async (
  req: Request<ReadEmployeeWorkCodesParams, unknown, unknown, unknown>,
  res: Response
) => {
  const result = await readEmployeeWorkCodes(req.params.id);
  if (!result.success) {
    throw new HttpException(
      result.status,
      `Error getting employee objects. ${result.message}`
    );
  } else {
    sendResponse(res, result);
  }
};

type CreateEmployeePreferenceParams = {
  id: number;
};

type CreateEmployeePreferenceBody = {
  PreferenceID: number;
  Value: string;
};

export const createEmployeePreferenceController: Controller = async (
  req: Request<
    CreateEmployeePreferenceParams,
    unknown,
    CreateEmployeePreferenceBody,
    unknown
  >,
  res: Response
) => {
  const result = await createEmployeePreference(
    req.params.id,
    req.body.PreferenceID,
    req.body.Value
  );

  if (!result.success) {
    throw new HttpException(
      result.status,
      `Error creating employee preference. ${result.message}`
    );
  } else {
    let parsedPref = getParsedPref(result.data);
    sendResponse(res, { ...result, data: parsedPref });
  }
};

type UpdateEmployeePreferenceParams = {
  EmployeePreferenceID: number;
};
type UpdateEmployeePreferenceBody = {
  Value: string;
};

export const updateEmployeePreferenceController: Controller = async (
  req: Request<
    UpdateEmployeePreferenceParams,
    unknown,
    UpdateEmployeePreferenceBody,
    unknown
  >,
  res: Response
) => {
  const result = await updateEmployeePreference(
    req.params.EmployeePreferenceID,
    req.body.Value
  );

  if (!result.success) {
    throw new HttpException(
      result.status,
      `Error updating employee preference. ${result.message}`
    );
  } else {
    let parsedPref = getParsedPref(result.data);
    sendResponse(res, { ...result, data: parsedPref });
  }
};

type CreateEmployeePinnedRowsParams = {
  id: number;
};

type CreateEmployeePinnedRowsBody = {
  DepartmentID: number;
  ProjectID: number;
  WorkCodeID: number;
};

export const createEmployeePinnedRowsController: Controller = async (
  req: Request<
    CreateEmployeePinnedRowsParams,
    unknown,
    CreateEmployeePinnedRowsBody,
    unknown
  >,
  res: Response
) => {
  const result = await createEmployeePinnedRows(
    req.params.id,
    req.body.DepartmentID,
    req.body.ProjectID,
    req.body.WorkCodeID
  );

  if (!result.success) {
    throw new HttpException(
      result.status,
      `Error creating employee preference. ${result.message}`
    );
  } else {
    sendResponse(res, result);
  }
};

type DeleteEmployeePinnedRowsParams = {
  EmployeePinnedRowID: number;
};

export const deleteEmployeePinnedRowsController: Controller = async (
  req: Request<DeleteEmployeePinnedRowsParams, unknown, unknown, unknown>,
  res: Response
) => {
  const result = await deleteEmployeePinnedRows(req.params.EmployeePinnedRowID);

  if (!result.success) {
    throw new HttpException(
      result.status,
      `Error deleting employee preference. ${result.message}`
    );
  } else {
    sendResponse(res, result);
  }
};
