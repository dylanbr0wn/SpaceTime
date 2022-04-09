import { sendResponse } from "../../services/utils";
import { updateWorkCode, createWorkCode } from "../../database/objectDB";
import { HttpException } from "../../services/error";
import { Request, Response } from "express";
import { Controller } from "../../services/types";

export const createWorkCodeController: Controller = async (
  req: Request,
  res: Response
) => {
  const result = await createWorkCode(req.body);
  if (!result.success) {
    throw new HttpException(
      result.status,
      `Error creating work code. ${result.message}`
    );
  } else {
    sendResponse(res, result);
  }
};

export const updateWorkCodeController: Controller = async (
  req: Request,
  res: Response
) => {
  const result = await updateWorkCode({
    ...req.body,
    WorkCodeID: req.params.id,
  });
  if (!result.success) {
    throw new HttpException(
      result.status,
      `Error updating work code objects. ${result.message}`
    );
  } else {
    sendResponse(res, result);
  }
};
