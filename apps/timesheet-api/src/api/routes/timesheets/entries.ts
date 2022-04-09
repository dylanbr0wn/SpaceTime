import express from 'express'

import {
    validate,
    timeEntryCreateValidationRules,
    timeEntryUpdateValidationRules,
    timeEntryDeleteValidationRules,
} from '../../services/validate'
import { createTimesheetEntryController, updateTimesheetEntryController, deleteTimesheetEntryController } from '../../controllers/timesheets/entriesController';
const router = express.Router({ mergeParams: true });


/**
 * @api {post} /timeEntry Create a time entry.
 * @apiName PostTimeEntry
 * @apiGroup TimeEntry
 * @apiDescription Create a new time entry.
 * @apiParam {Number} EmployeeID Employee ID for time entry.
 * @apiParam {Number} ProjectID Project ID for entry.
 * @apiParam {Number} WorkCodeID Work code ID for entry.
 * @apiParam {Number} HoursWorked Number of hours worked in entry.
 * @apiParam {String} DateofWork Date string for day of time entry work.
 * @apiParam {String} Comment
 */
router.post('/',
    validate(timeEntryCreateValidationRules),
    createTimesheetEntryController)

/**
* @api {put} /timeEntry/:id Update a time entry.
* @apiName PutTimeEntry
* @apiGroup TimeEntry
* @apiDescription Update a time entry.
* @apiParam {Number} id Time entry ID to update.
* @apiParam {Number} EmployeeID Employee ID for time entry.
* @apiParam {Number} ProjectID Project ID for entry.
* @apiParam {Number} WorkCodeID Work code ID for entry.
* @apiParam {Number} HoursWorked Number of hours worked in entry.
* @apiParam {String} DateofWork Date string for day of time entry work.
* @apiParam {String} Comment
*/
router.put('/:entryid',
    validate(timeEntryUpdateValidationRules),
    updateTimesheetEntryController)

/**
* @api {delete} /timeEntry/:id Delete a time entry.
* @apiName DeleteTimeEntry
* @apiGroup TimeEntry
* @apiDescription Delete a time entry.
* @apiParam {Number} id Time entry ID to delete.
*/
router.delete('/:entryid',
    validate(timeEntryDeleteValidationRules),
    deleteTimesheetEntryController)

export default router