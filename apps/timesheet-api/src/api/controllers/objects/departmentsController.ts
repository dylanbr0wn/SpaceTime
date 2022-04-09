import { sendResponse } from "../../services/utils";
import { updateDepartment, createDepartment } from "../../database/objectDB";
import { HttpException } from "../../services/error";
import { Request, Response } from "express";
import { Controller } from "../../services/types";

export const createDepartmentController: Controller = async (
  req: Request,
  res: Response
) => {
  const result = await createDepartment({ ...req.body });
  if (!result.success) {
    throw new HttpException(
      result.status,
      `Error creating department. ${result.message}`
    );
  } else {
    sendResponse(res, result);
  }
};

export const updateDepartmentController: Controller = async (
  req: Request,
  res: Response
) => {
  const result = await updateDepartment({
    ...req.body,
    DepartmentID: req.params.id,
  });
  if (!result.success) {
    throw new HttpException(
      result.status,
      `Error updating department objects. ${result.message}`
    );
  } else {
    sendResponse(res, result);
  }
};
