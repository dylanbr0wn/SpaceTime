import express from 'express'

import {
    validate,
    dayCommentCreateValidationRules,
    dayCommentUpdateValidationRules,
    dayCommentDeleteValidationRules,
} from '../../services/validate'
import { createDayCommentController, updateDayCommentController, deleteDayCommentController } from '../../controllers/timesheets/dayCommentsController';
const router = express.Router({ mergeParams: true });

/**
* @api {post} /timeEntry/dayComment Create day comment.
* @apiName PostDayComment
* @apiGroup TimeEntry
* @apiDescription Create a day comment in the DayComment table.
* @apiParam {Number} EmployeeID Employee ID for day comment.
* @apiParam {String} DateofComment Date string for day comment.
* @apiParam {String} Comment
*/
router.post('/',
    validate(dayCommentCreateValidationRules),
    createDayCommentController)

/**
 * @api {put} timeEntry/dayComment/:id Update day comment.
 * @apiName PutDayComment
 * @apiGroup TimeEntry
 * @apiDescription Update a day comment in the DayComment table.
 * @apiParam {Number} id Time entry ID.
 * @apiParam {String} comment
 */
router.put('/:dayCommentid',
    validate(dayCommentUpdateValidationRules),
    updateDayCommentController)

/**
 * @api {delete} /timeEntry/dayComment/:id Delete a day comment.
 * @apiName DeleteDayComment
 * @apiGroup TimeEntry
 * @apiDescription Delete a day comment in the DayComment table.
 * @apiParam {Number} id Time entry ID.
 */
router.delete('/:dayCommentid',
    validate(dayCommentDeleteValidationRules),
    deleteDayCommentController)

export default router