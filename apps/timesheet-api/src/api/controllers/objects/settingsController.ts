import { sendResponse } from "../../services/utils";
import { updateSettings } from "../../database/objectDB";
import { HttpException } from "../../services/error";
import { Request, Response } from "express";
import { Controller } from "../../services/types";

export const updateSettingsController: Controller = async (
  req: Request,
  res: Response
) => {
  const result = await updateSettings(req.body);
  if (!result.success) {
    throw new HttpException(
      result.status,
      `Error updating settings objects. ${result.message}`
    );
  } else {
    sendResponse(res, result);
  }
};
