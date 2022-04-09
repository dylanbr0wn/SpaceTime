import express from "express";
const router = express.Router();
import projects from "./projects";
import departments from "./departments";
import workCodes from "./workCodes";
import settings from "./settings";
import { readObjectsController } from "../../controllers/objects/objectsController";

router.use("/projects", projects);
router.use("/departments", departments);
router.use("/workCodes", workCodes);
router.use("/settings", settings);
/**
 * @api {get} /object/ Get Objects
 * @apiName GetObjects
 * @apiGroup Objects
 * @apiDescription Get timesheet objects
 */
router.get("/", readObjectsController);

export default router;
