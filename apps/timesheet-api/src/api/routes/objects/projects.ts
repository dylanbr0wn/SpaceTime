import express from "express";
const router = express.Router();
import { checkAdmin } from "../../services/middleware";

import {
    validate,
    projectCreateValidationRules,
    projectUpdateValidationRules,
} from "../../services/validate";

import {
    createProjectController,
    updateProjectController,
} from "../../controllers/objects/projectsController";

/**
 * @api {post} /object/project Create Project
 * @apiName PostObjectProject
 * @apiGroup Objects
 * @apiDescription Create a new project.
 * @apiParam {Number} DepartmentID The department running the project.
 * @apiParam {String} GLCode
 * @apiParam {String} DeptCode
 * @apiParam {String} Name Project name.
 * @apiParam {String} Description Project description.
 * @apiParam {Boolean} IsActive Is this project active.
 */
router.post(
    "/",
    validate(projectCreateValidationRules),
    checkAdmin(),
    createProjectController
);

/**
 * @api {put} /object/project/:id Update Project
 * @apiName PutObjectProject
 * @apiGroup Objects
 * @apiDescription Update a project.
 * @apiParam {Number} id Project ID.
 * @apiParam {Number} DepartmentID The department running the project.
 * @apiParam {String} GLCode
 * @apiParam {String} DeptCode
 * @apiParam {String} Name Project name.
 * @apiParam {String} Description Project description.
 * @apiParam {Boolean} IsActive Is this project active.
 */
router.put(
    "/:id",
    validate(projectUpdateValidationRules),
    checkAdmin(),
    updateProjectController
);

export default router;
