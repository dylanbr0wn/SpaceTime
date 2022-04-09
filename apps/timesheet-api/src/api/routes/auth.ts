import express from "express";
const router = express.Router();

import { ADController } from "../controllers/authController";

/**
 * @api {post} /auth/ad Azure Active Directory Auth.
 * @apiName ADAuth
 * @apiGroup Auth
 * @apiDescription Authorize an employee through Azure AD
 */
router.post("/ad", ADController);

export default router;
