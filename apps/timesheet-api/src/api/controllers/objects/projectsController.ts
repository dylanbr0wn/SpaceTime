import { sendResponse } from "../../services/utils";
import { updateProject, createProject } from "../../database/objectDB";
import { HttpException } from "../../services/error";
import { Request, Response } from "express";
import { Controller } from "../../services/types";

export const createProjectController: Controller = async (
  req: Request,
  res: Response
) => {
  const result = await createProject({ ...req.body });
  if (!result.success) {
    throw new HttpException(
      result.status,
      `Error creating project. ${result.message}`
    );
  } else {
    sendResponse(res, result);
  }
};
export const updateProjectController: Controller = async (
  req: Request,
  res: Response
) => {
  const result = await updateProject({
    ...req.body,
    ProjectID: req.params.id,
  });
  if (!result.data) {
    throw new HttpException(
      result.status,
      `Error updating project objects. ${result.message}`
    );
  } else {
    sendResponse(res, result);
  }
};
