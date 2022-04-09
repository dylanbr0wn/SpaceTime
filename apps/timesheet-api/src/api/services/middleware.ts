import { NextFunction, Request, Response } from "express";
import {
    checkTimesheetLock,
    readEmployeeApproval,
} from "../database/timesheetDB";
import { HttpException } from "./error";
import { AsyncMiddleware, Middleware, UserInfo } from "./types";

export const checkLock: AsyncMiddleware =
    () => async (req: any, _res: Response, next: NextFunction) => {
        try {
            if (parseInt(req.params.id) !== (req.user?.EmployeeID ?? -1))
                return next();
            const isLocked = await checkTimesheetLock(
                req.user?.EmployeeID ?? -1
            );
            if (isLocked.data.locked) {
                throw new HttpException(
                    423,
                    "Timesheet is locked. Contact your supervisor for assistance."
                );
            }
            return next();
        } catch (err) {
            return next(err);
        }
    };
export const checkValidUser = (user: UserInfo | undefined) => {
    if (user === undefined) {
        throw new HttpException(
            423,
            "Error loading user. Please refresh the page."
        );
    }
};

export const checkApproval: AsyncMiddleware =
    () => async (req: any, res: Response, next: NextFunction) => {
        try {
            const EmployeeID = req.user?.EmployeeID ?? -1;

            if (req.params.id !== EmployeeID) return next();
            const { success, data, status, message } =
                await readEmployeeApproval(req.query.startDate, EmployeeID);
            if (!success)
                throw new HttpException(
                    status,
                    `Couldnt Check approval. ${message}`
                );
            if (data === null) return next();
            if (data.ApprovalStatus !== null && data.ApprovalStatus !== 0) {
                throw new HttpException(
                    423,
                    "Your timesheet has been updated. Please reload the page."
                );
            }
            return next();
        } catch (err) {
            return next(err);
        }
    };

/**
 * @function checkAdmin
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {Function} next Callback to next function
 * @description
 * Checks to see if user is administrator or not. Required for certain routes.
 */
export const checkAdmin: Middleware =
    () => (req: any, res: Response, next: NextFunction) => {
        checkValidUser(req.user);

        const IsAdministrator = req.user?.IsAdministrator ?? false;

        if (!IsAdministrator) {
            return next(
                new HttpException(403, "You do not permissions to access this.")
            );
        } else {
            return next();
        }
    };

export const checkSupervisor: Middleware =
    () => (req: any, res: Response, next: NextFunction) => {
        checkValidUser(req.user);

        const IsAdministrator = req.user?.IsAdministrator ?? false;
        const IsPayrollClerk = req.user?.IsPayrollClerk ?? false;
        const IsSupervisor = req.user?.IsSupervisor ?? false;

        if (!IsSupervisor && !IsAdministrator && !IsPayrollClerk) {
            return next(
                new HttpException(403, "You do not permissions to access this.")
            );
        } else {
            return next();
        }
    };

export const checkPayroll: Middleware =
    () =>
    (req: Request<any, any, any, any>, res: Response, next: NextFunction) => {
        checkValidUser(req.user);

        const IsAdministrator = req.user?.IsAdministrator ?? false;
        const IsPayrollClerk = req.user?.IsPayrollClerk ?? false;
        if (!IsPayrollClerk && !IsAdministrator) {
            return next(
                new HttpException(403, "You do not permissions to access this.")
            );
        } else {
            return next();
        }
    };
