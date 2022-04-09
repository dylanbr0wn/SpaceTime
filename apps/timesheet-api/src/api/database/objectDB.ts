import { Int, VarChar, Bit, Numeric, Decimal, DateTimeOffset } from "mssql";
import { getPool } from "../../config/database";
import { Department, Project, Settings, WorkCode } from "../services/types";
import { handleDatabaseError, handleDatabaseResult } from "../services/utils";

/**
 * @async
 * @function readObjects
 * @returns {Object}
 * @description Read all timesheet objects.
 */
export const readObjects = async () => {
  try {
    let pool = await getPool();
    let departments = await pool.request().query(`SELECT * FROM Department
                ORDER BY DeptName;
            `);

    let projects = await pool.request().query(`SELECT * FROM Project
                ORDER BY Name;
            `);

    let settings = await pool.request().query(`SELECT * FROM Settings`);

    let workCodes = await pool.request().query(`SELECT * FROM WorkCode
                ORDER BY Description; 
            `);

    return handleDatabaseResult({
      departments: departments.recordset,
      projects: projects.recordset,
      workCodes: workCodes.recordset,
      settings: settings.recordset[0],
    });
  } catch (err) {
    return handleDatabaseError(err);
  }
};

/**
 * @async
 * @function createProject
 * @param {Object} Project Project to create in database.
 * @returns {Object}
 * @description Create project in the database.
 */
export const createProject = async ({
  DepartmentID,
  Name,
  Description,
  IsActive,
  GLCode,
  DeptCode,
}: Project) => {
  try {
    let pool = await getPool();

    let project = await pool
      .request()
      .input("DepartmentID", Int, DepartmentID)
      .input("Name", VarChar(50), Name)
      .input("Description", VarChar(50), Description)
      .input("IsActive", Bit, IsActive)
      .input("GLCode", VarChar(20), GLCode)
      .input("DeptCode", VarChar(20), DeptCode).query(`
            INSERT INTO Project (DepartmentID, Name, Description, IsActive, GLCode, DeptCode)
            OUTPUT inserted.*
            VALUES (@DepartmentID, @Name, @Description, @IsActive, @GLCode, @DeptCode);
            `);
    return handleDatabaseResult(project.recordset[0]);
  } catch (err) {
    return handleDatabaseError(err);
  }
};

/**
 * @async
 * @function updateProject
 * @param {Object} Project Project to update in database.
 * @returns {Object}
 * @description Update project in the database.
 */
export const updateProject = async ({
  ProjectID,
  DepartmentID,
  Name,
  Description,
  IsActive,
  GLCode,
  DeptCode,
}: Project) => {
  try {
    let pool = await getPool();

    let project = await pool
      .request()
      .input("ProjectID", Int, ProjectID)
      .input("DepartmentID", Int, DepartmentID)
      .input("Name", VarChar(50), Name)
      .input("Description", VarChar(50), Description)
      .input("IsActive", Bit, IsActive)
      .input("GLCode", VarChar(20), GLCode)
      .input("DeptCode", VarChar(20), DeptCode).query(`UPDATE Project 
            SET DepartmentID = @DepartmentID, 
            Name = @Name,
            Description = @Description,
            IsActive = @IsActive,
            GLCode = @GLCode,
            DeptCode = @DeptCode
            OUTPUT inserted.*
            WHERE ProjectID = @ProjectID;
            `);

    return handleDatabaseResult(project.recordset[0]);
  } catch (err) {
    return handleDatabaseError(err);
  }
};

/**
 * @async
 * @function createDepartment
 * @param {Object} Department Department to create in database.
 * @returns {Object}
 * @description Create department in the database.
 */
export const createDepartment = async ({ DeptName, IsActive }: Department) => {
  try {
    let pool = await getPool();

    let department = await pool
      .request()
      .input("DeptName", VarChar(50), DeptName)
      .input("IsActive", Bit, IsActive).query(`
            INSERT INTO Department (DeptName, IsActive)
            OUTPUT inserted.*
            VALUES (@DeptName, @IsActive);
            `);

    return handleDatabaseResult(department.recordset[0]);
  } catch (err) {
    return handleDatabaseError(err);
  }
};

/**
 * @async
 * @function updateDepartment
 * @param {Object} Department Department to update in database.
 * @returns {Object}
 * @description Update department in the database.
 */
export const updateDepartment = async ({
  DepartmentID,
  DeptName,
  IsActive,
}: Department) => {
  try {
    let pool = await getPool();

    let department = await pool
      .request()
      .input("DepartmentID", Int, DepartmentID)
      .input("DeptName", VarChar(50), DeptName)
      .input("IsActive", Bit, IsActive).query(`UPDATE Department 
            SET DeptName = @DeptName,
            IsActive = @IsActive
            OUTPUT inserted.*
            WHERE DepartmentID = @DepartmentID;
            `);

    return handleDatabaseResult(department.recordset[0]);
  } catch (err) {
    return handleDatabaseError(err);
  }
};

/**
 * @async
 * @function createWorkCode
 * @param {Object} WorkCode Work code to create in database.
 * @returns {Object}
 * @description Create work code in the database.
 */
export const createWorkCode = async ({
  Code,
  Description,
  IsDefault,
  ExportToDynamics,
  Multiplier,
}: WorkCode) => {
  try {
    let pool = await getPool();

    let workCode = await pool
      .request()
      .input("Code", VarChar(15), Code)
      .input("Description", VarChar(50), Description)
      .input("IsDefault", Bit, IsDefault)
      .input("ExportToDynamics", Bit, ExportToDynamics)
      .input("Multiplier", Numeric(4, 2), Multiplier).query(`
            INSERT INTO WorkCode (Code, Description, IsDefault, ExportToDynamics, Multiplier)
            OUTPUT inserted.*
            VALUES (@Code, @Description, @IsDefault, @ExportToDynamics, @Multiplier);
            `);

    return handleDatabaseResult(workCode.recordset[0]);
  } catch (err) {
    return handleDatabaseError(err);
  }
};

/**
 * @async
 * @function updateWorkCode
 * @param {Object} WorkCode Work code to update in database.
 * @returns {Object}
 * @description Update work code in the database.
 */
export const updateWorkCode = async ({
  WorkCodeID,
  Code,
  Description,
  IsDefault,
  ExportToDynamics,
  Multiplier,
}: WorkCode) => {
  try {
    let pool = await getPool();

    let workCode = await pool
      .request()
      .input("WorkCodeID", Int, WorkCodeID)
      .input("Code", VarChar(15), Code)
      .input("Description", VarChar(50), Description)
      .input("IsDefault", Bit, IsDefault)
      .input("ExportToDynamics", Bit, ExportToDynamics)
      .input("Multiplier", Numeric(4, 2), Multiplier).query(`UPDATE WorkCode
            SET Code = @Code,
            Description = @Description,
            IsDefault = @IsDefault,
            ExportToDynamics = @ExportToDynamics,
            Multiplier = @Multiplier
            OUTPUT inserted.*
            WHERE WorkCodeID = @WorkCodeID;
            `);

    return handleDatabaseResult(workCode.recordset[0]);
  } catch (err) {
    return handleDatabaseError(err);
  }
};

/**
 * @async
 * @function readSettings
 * @returns {Object}
 * @description Read all timesheet settings.
 */
export const readSettings = async () => {
  try {
    let pool = await getPool();

    let settings = await pool.request().query(`SELECT * FROM Settings`);

    return handleDatabaseResult(settings.recordset[0]);
  } catch (err) {
    return handleDatabaseError(err);
  }
};

/**
 * @async
 * @function updateSettings
 * @param {Settings} Settings Settings to update in database.
 * @returns {Object}
 * @description Update settings in the database.
 */
export const updateSettings = async ({
  CutOffDate,
  HoursPerDay,
  RecordID,
  SharepointURLForApproval,
}: Settings) => {
  try {
    let pool = await getPool();
    CutOffDate.setHours(0);
    let settings = await pool
      .request()
      .input("CutOffDate", DateTimeOffset, CutOffDate)
      .input("HoursPerDay", Decimal(4, 2), HoursPerDay)
      .input("RecordID", Int, RecordID)
      .input("SharepointURLForApproval", VarChar(256), SharepointURLForApproval)
      .query(`UPDATE Settings
            SET HoursPerDay = @HoursPerDay,
            CutOffDate = @CutOffDate,
            SharepointURLForApproval = @SharepointURLForApproval
            OUTPUT inserted.*
            WHERE RecordID = @RecordID;
            `);
    return handleDatabaseResult(settings.recordset[0]);
  } catch (err) {
    return handleDatabaseError(err);
  }
};
