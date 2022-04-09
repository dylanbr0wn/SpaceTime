import { sendResponse } from "../../services/utils";
import { readObjects } from "../../database/objectDB";
import { HttpException } from "../../services/error";
import { Request, Response } from "express";
import { Controller } from "../../services/types";

export const readObjectsController: Controller = async (
  req: Request,
  res: Response
) => {
  const result = await readObjects();
  if (!result.success) {
    throw new HttpException(
      result.status,
      `Error getting objects. ${result.message}`
    );
  } else {
    sendResponse(res, result);
  }
};
