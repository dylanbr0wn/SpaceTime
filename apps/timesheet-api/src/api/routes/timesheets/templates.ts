import express from 'express'

import {
    validate,
    templateCreateValidationRules,
    templateUpdateValidationRules,
    templateDeleteValidationRules,
    templateLoadValidationRules,
} from '../../services/validate'
import { createTemplateController, updateTemplateController, deleteTemplateController, loadTemplateController } from '../../controllers/timesheets/templatesController';
import { checkApproval, checkLock } from '../../services/middleware';
const router = express.Router({ mergeParams: true });

/**
 * @api {post} /timeEntry/template Create a template.
 * @apiName PostTemplate
 * @apiGroup TimeEntry
 * @apiDescription Create a template in the Template and TemplateEntries tables.
 * @apiParam {Number} EmployeeID Employee ID for template.
 * @apiParam {String} TemplateName Name of template.
 * @apiParam {Object} Entries Time sheet entries to add into template. 
 */
router.post('/',
    validate(templateCreateValidationRules),
    createTemplateController)

/**
 * @api {put} /timeEntry/template/:id Update a template.
 * @apiName PutTemplate
 * @apiGroup TimeEntry
 * @apiDescription Update a template in the Template and TemplateEntries tables.
 * @apiParam {Number} id TEmplate ID for template and entries.
 * @apiParam {Object} Entries Time sheet entries to update into template. 
 * @apiParam {Number} EmployeeID Employee ID for template.
 */
router.put('/:templateid',
    validate(templateUpdateValidationRules),
    updateTemplateController)

/**
 * @api {delete} /timeEntry/template/:id Delete a template.
 * @apiName DeleteTemplate
 * @apiGroup TimeEntry
 * @apiDescription Delete a template in the Template and TemplateEntries tables.
 * @apiParam {Number} id Template ID for template and entries.
 */
router.delete('/:templateid',
    validate(templateDeleteValidationRules),
    deleteTemplateController)

/**
 * @api {post} /timeEntry/template/:id Load a template.
 * @apiName LoadTemplate
 * @apiGroup TimeEntry
 * @apiDescription Clear current timesheet and load a template.
 * @apiParam {Number} id Template ID for template and entries.
 * @apiParam {Object} timeSheet Time sheet entries to clear. 
 * @apiParam {Number} EmployeeID Employee ID for template.
 * @apiParam {String} startDate Date string for start of timesheet.
 */
router.post('/:templateid',
    checkLock(),
    checkApproval(),
    validate(templateLoadValidationRules),
    loadTemplateController)

export default router