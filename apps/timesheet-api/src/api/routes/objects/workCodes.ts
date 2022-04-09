import express from "express";
const router = express.Router();
import { checkAdmin } from "../../services/middleware";

import {
    validate,
    workCodeCreateValidationRules,
    workCodeUpdateValidationRules,
} from "../../services/validate";

import {
    createWorkCodeController,
    updateWorkCodeController,
} from "../../controllers/objects/workCodesController";

/**
 * @api {post} /object/workCode Create Work Code
 * @apiName PostObjectWorkCode
 * @apiGroup Objects
 * @apiDescription Create a new work code.
 * @apiParam {String} Code
 * @apiParam {String} Description Work code description.
 * @apiParam {Boolean} IsDefault Is this work code a default.
 * @apiParam {Boolean} ExportToDynamics Is this work code exported in dynamics report.
 * @apiParam {Number} Multiplier Wage multiplier.
 */
router.post(
    "/",
    validate(workCodeCreateValidationRules),
    checkAdmin(),
    createWorkCodeController
);

/**
 * @api {put} /object/workCode/:id Update Work Code
 * @apiName PutObjectWorkCode
 * @apiGroup Objects
 * @apiDescription Update a work code.
 * @apiParam {Number} id Work code id.
 * @apiParam {String} Code
 * @apiParam {String} Description Work code description.
 * @apiParam {Boolean} IsDefault Is this work code a default.
 * @apiParam {Boolean} ExportToDynamics Is this work code exported in dynamics report.
 * @apiParam {Number} Multiplier Wage multiplier.
 */
router.put(
    "/:id",
    validate(workCodeUpdateValidationRules),
    checkAdmin(),
    updateWorkCodeController
);

export default router;
