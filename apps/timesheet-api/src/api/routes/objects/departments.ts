import express from "express";
const router = express.Router();
import { checkAdmin } from "../../services/middleware";
import {
    validate,
    departmentCreateValidationRules,
    departmentUpdateValidationRules,
} from "../../services/validate";

import {
    createDepartmentController,
    updateDepartmentController,
} from "../../controllers/objects/departmentsController";

/**
 * @api {post} /object/department Create Department
 * @apiName PostObjectDepartment
 * @apiGroup Objects
 * @apiDescription Create a new department.
 * @apiParam {String} DeptName Name of department.
 * @apiParam {Boolean} IsActive Is this department active.
 */
router.post(
    "/",
    validate(departmentCreateValidationRules),
    checkAdmin(),
    createDepartmentController
);

/**
 * @api {put} /object/department/:id Update Department
 * @apiName PutObjectDepartment
 * @apiGroup Objects
 * @apiDescription Update a department.
 * @apiParam {Number} id Department ID.
 * @apiParam {String} DeptName Name of department.
 * @apiParam {Boolean} IsActive Is this department active.
 */
router.put(
    "/:id",
    validate(departmentUpdateValidationRules),
    checkAdmin(),
    updateDepartmentController
);

export default router;
