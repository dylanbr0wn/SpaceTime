import express from "express";
const router = express.Router();
import { checkAdmin } from "../../services/middleware";

import {
    validate,
    settingsUpdateValidationRules,
} from "../../services/validate";

import { updateSettingsController } from "../../controllers/objects/settingsController";

/**
 * @api {put} /object/settings Update Settings
 * @apiName PutObjectSettings
 * @apiGroup Objects
 * @apiDescription Update timesheet settings.
 * @apiParam {Number} HoursPerDay.
 * @apiParam {Number} RecordID.
 * @apiParam {String} SharepointURLForApproval URL of sharepoint approval repository.
 * @apiParam {String} CutOffDate Time sheet cut off date.
 */
router.put(
    "/",
    validate(settingsUpdateValidationRules),
    checkAdmin(),
    updateSettingsController
);

export default router;
