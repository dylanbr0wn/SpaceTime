import compression from "compression";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import logger from "morgan";
import passport from "passport";

import "dotenv/config";
import "./api/services/passport";

import approvals from "./api/routes/approvals";
import auth from "./api/routes/auth";
import employees from "./api/routes/employees";
import objects from "./api/routes/objects/objects";
import reports from "./api/routes/reports";
import timesheets from "./api/routes/timesheets/timesheets";
import { handleError } from "./api/services/error";

const port = process.env.PORT || 3000;

const app = express();

if (process.env.NODE_ENV === "production") {
    app.use(
        // Some HTTP request security header congiguration middleware
        helmet()
    );
    app.use(logger("common"));
} else {
    app.use(
        // Some HTTP request security header congiguration middleware
        helmet({
            hsts: false,
        })
    );
    app.use(logger("info"));
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(compression());

app.use(
    "/api/auth",
    passport.authenticate("oauth-bearer", { session: false }),
    auth
); // Auth route is exposed for login purposes.
app.use(
    "/api/employees",
    passport.authenticate("oauth-bearer", { session: false }),
    employees
); // Employee related calls.
app.use(
    "/api/reports",
    passport.authenticate("oauth-bearer", { session: false }),
    reports
); // Report related calls.
app.use(
    "/api/objects",
    passport.authenticate("oauth-bearer", { session: false }),
    objects
); // Object (Project, department, work code) related calls.

app.use(
    "/api/timesheets",
    passport.authenticate("oauth-bearer", {
        session: false,
        failureMessage: true,
    }),
    timesheets
); // Time entry related calls.
app.use(
    "/api/approvals",
    passport.authenticate("oauth-bearer", { session: false }),
    approvals
);

app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
    // Error handler
    handleError(err, req, res);
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

export default app;
