import { Request, Response } from "express";

export class HttpException extends Error {
    statusCode?: number;
    constructor(status: number, message: string) {
        super(message);
        this.statusCode = status;
        this.message = message;
    }
}

export const handleError = (
    err: HttpException,
    req: Request,
    res: Response
) => {
    const statusCode = err.statusCode === 1000 ? 500 : err.statusCode ?? 500;
    const message = statusCode === 500 ? "Server Error" : err.message;
    console.error("Status: ", statusCode);
    console.error("Error Message: ", err.message);
    console.error("Message: ", message);
    console.error("Request URL: ", req.originalUrl);
    console.error("Request Method: ", req.method);
    console.error("Request Body: ", req.body);
    console.error("Request Header: ", req.headers);

    res.status(statusCode).json({
        status: "error",
        statusCode,
        message:
            err.message === message ? message : `${message}: ${err.message}`,
        data: null,
    });
};
