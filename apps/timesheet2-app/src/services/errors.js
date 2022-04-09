
export class InvalidTokenError extends Error {
    constructor(message) {

        super(message);

        Error.captureStackTrace(this, this.constructor);

        this.name = 'InvalidTokenError';
    }

}

export class EmployeeNotFoundError extends Error {
    constructor(message) {

        super(message);

        Error.captureStackTrace(this, this.constructor);

        this.name = 'EmployeeNotFoundError';
    }
}