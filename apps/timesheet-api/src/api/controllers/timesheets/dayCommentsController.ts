import { sendResponse } from "../../services/utils";
import { HttpException } from "../../services/error";
import {
  deleteTimeSheetDayComment,
  createTimeSheetDayComment,
  updateTimeSheetDayComment,
} from "../../database/timesheetDB";
import { Request, Response } from "express";
import { Controller } from "../../services/types";

export const createDayCommentController: Controller = async (
  req: Request,
  res: Response
) => {
  const result = await createTimeSheetDayComment(req.body);
  if (!result.success) {
    throw new HttpException(
      result.status,
      `Couldnt create time sheet day comment. ${result.message}`
    );
  } else {
    sendResponse(res, result);
  }
};

type UpdateDayCommentParams = {
  dayCommentid: number;
};
type UpdateDayCommentBody = {
  comment: string;
};

export const updateDayCommentController: Controller = async (
  req: Request<UpdateDayCommentParams, unknown, UpdateDayCommentBody, unknown>,
  res: Response
) => {
  const result = await updateTimeSheetDayComment(
    req.params.dayCommentid,
    req.body.comment
  );
  if (!result.success) {
    throw new HttpException(
      result.status,
      `Couldnt update time sheet day comment. ${result.message}`
    );
  } else {
    sendResponse(res, result);
  }
};

type DeleteDayCommentParams = {
  dayCommentid: number;
};

export const deleteDayCommentController: Controller = async (
  req: Request<DeleteDayCommentParams, unknown, unknown, unknown>,
  res: Response
) => {
  const result = await deleteTimeSheetDayComment(req.params.dayCommentid);
  if (!result.success) {
    throw new HttpException(
      result.status,
      `Couldnt delete time sheet day comment. ${result.message}`
    );
  } else {
    sendResponse(res, result);
  }
};
