import {
  createApproval,
  updateApprovalEmployee,
  updateApprovalPayroll,
  updateApprovalSupervisor,
} from "../database/approvalDB";
import { sendResponse } from "../services/utils";
import { HttpException } from "../services/error";
import { Request, Response } from "express";
import { Approval, Controller } from "../services/types";

type UpdatePayrollApprovalParams = {
  id: number;
};

export const updatePayrollApprovalController: Controller = async (
  req: Request<UpdatePayrollApprovalParams, unknown, Approval, unknown>,
  res: Response
) => {
  let result = await updateApprovalPayroll(req.body, req.params.id);
  if (!result.success) {
    throw new HttpException(
      result.status,
      `Error getting employee. ${result.message}`
    ); // SQL Error
  } else {
    sendResponse(res, result);
  }
};

type UpdateSupervisorApprovalParams = {
  id: number;
};

export const updateSupervisorApprovalController: Controller = async (
  req: Request<UpdateSupervisorApprovalParams, unknown, Approval, unknown>,
  res: Response
) => {
  let result = await updateApprovalSupervisor(req.body, req.params.id);
  if (!result.success) {
    throw new HttpException(
      result.status,
      `Error getting employee. ${result.message}`
    ); // SQL Error
  } else {
    sendResponse(res, result);
  }
};
export const updateEmployeeApprovalController: Controller = async (
  req: Request,
  res: Response
) => {
  let result = await updateApprovalEmployee(req.body);
  if (!result.success) {
    throw new HttpException(
      result.status,
      `Error getting employee. ${result.message}`
    ); // SQL Error
  } else {
    sendResponse(res, result);
  }
};
export const createApprovalController: Controller = async (
  req: Request,
  res: Response
) => {
  let result = await createApproval(req.body);
  if (!result.success) {
    throw new HttpException(
      result.status,
      `Error getting employee. ${result.message}`
    ); // SQL Error
  } else {
    sendResponse(res, result);
  }
};
