import express from "express";
const router = express.Router();

import {
    updatePayrollApprovalController,
    updateSupervisorApprovalController,
    updateEmployeeApprovalController,
    createApprovalController,
} from "../controllers/approvalsController";
import { checkPayroll, checkSupervisor } from "../services/middleware";
import {
    validate,
    updatePayrollApprovalValidationRules,
    updateSupervisorApprovalValidationRules,
    createApprovalValidationRules,
} from "../services/validate";

router.put(
    "/:id/payroll",
    validate(updatePayrollApprovalValidationRules),
    checkPayroll(),
    updatePayrollApprovalController
);

router.put(
    "/:id/supervisor",
    validate(updateSupervisorApprovalValidationRules),
    checkSupervisor(),
    updateSupervisorApprovalController
);

router.put(
    "/:id/employee",

    updateEmployeeApprovalController
);

router.post(
    "/",
    validate(createApprovalValidationRules),
    createApprovalController
);

export default router;
