import { Int, NVarChar, BigInt } from "mssql";
import { getPool } from "../../config/database";
import { Approval } from "../services/types";
import { handleDatabaseError, handleDatabaseResult } from "../services/utils";

export const createApproval = async ({
    SubmissionID,
}: {
    SubmissionID: number;
}) => {
    try {
        const pool = await getPool();
        const result1 = await pool
            .request()
            .input("SubmissionID", BigInt, SubmissionID)
            .query(`INSERT INTO TimesheetApprovals (SubmissionID, LastUpdated)
            OUTPUT inserted.*
            VALUES (@SubmissionID, CURRENT_TIMESTAMP);`);

        return handleDatabaseResult(result1.recordset[0]);
    } catch (err) {
        return handleDatabaseError(err);
    }
};

export const updateApprovalSupervisor = async (
    { ApprovalStatus, SupervisorComment }: Approval,
    ApprovalID: number
) => {
    try {
        const pool = await getPool();
        const result1 = await pool
            .request()
            .input("ApprovalStatus", Int, ApprovalStatus)
            .input("SupervisorComment", NVarChar, SupervisorComment)
            .input("ApprovalID", Int, ApprovalID)
            .query(`UPDATE TimesheetApprovals
            SET ApprovalStatus = @ApprovalStatus,
            LastUpdated = CURRENT_TIMESTAMP,
            SupervisorComment = @SupervisorComment
            OUTPUT inserted.*
            WHERE ApprovalID = @ApprovalID;`);

        return handleDatabaseResult(result1.recordset[0]);
    } catch (err) {
        return handleDatabaseError(err);
    }
};

export const updateApprovalPayroll = async (
    { ApprovalStatus, PayrollComment }: Approval,
    ApprovalID: number
) => {
    try {
        const pool = await getPool();
        const result1 = await pool
            .request()
            .input("ApprovalStatus", Int, ApprovalStatus)
            .input("PayrollComment", NVarChar, PayrollComment ?? "")
            .input("ApprovalID", Int, ApprovalID)
            .query(`UPDATE TimesheetApprovals
            SET ApprovalStatus = @ApprovalStatus,
            LastUpdated = CURRENT_TIMESTAMP,
            PayrollComment = @PayrollComment
            OUTPUT inserted.*
            WHERE ApprovalID = @ApprovalID;`);

        return handleDatabaseResult(result1.recordset[0]);
    } catch (err) {
        return handleDatabaseError(err);
    }
};

export const updateApprovalEmployee = async ({
    ApprovalStatus,
    ApprovalID,
}: {
    ApprovalStatus: number | null;
    ApprovalID: number;
}) => {
    try {
        const pool = await getPool();
        const result1 = await pool
            .request()
            .input("ApprovalStatus", Int, ApprovalStatus)
            .input("ApprovalID", Int, ApprovalID)
            .query(`UPDATE TimesheetApprovals
            SET ApprovalStatus = @ApprovalStatus,
            LastUpdated = CURRENT_TIMESTAMP
            OUTPUT inserted.*
            WHERE ApprovalID = @ApprovalID;`);

        return handleDatabaseResult(result1.recordset[0]);
    } catch (err) {
        return handleDatabaseError(err);
    }
};
