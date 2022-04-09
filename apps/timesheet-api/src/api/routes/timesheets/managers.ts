import express from 'express'
const router = express.Router();
import entries from './entries'
import templates from './templates'
import dayComments from './dayComments'
import { readManagerSubordinatesController, lockEmployeeTimesheetController, unlockEmployeeTimesheetController } from '../../controllers/timesheets/managersController';
import { readManagerSubordinatesValidationRules, lockEmployeeTimesheetValidationRules, unlockEmployeeTimesheetValidationRules, validate } from '../../services/validate';

router.use('/entries', entries)
router.use('/templates', templates)
router.use('/dayComments', dayComments)

router.get('/:id/subordinates',
    validate(readManagerSubordinatesValidationRules),
    readManagerSubordinatesController)

router.post('/:id/lockEmployee/:subordinateid',
    validate(lockEmployeeTimesheetValidationRules),
    lockEmployeeTimesheetController
)

router.delete('/:id/unlockEmployee/:subordinateid',
    validate(unlockEmployeeTimesheetValidationRules),
    unlockEmployeeTimesheetController
)



export default router