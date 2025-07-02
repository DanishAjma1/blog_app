class AppError extends Error{
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // Indicates that this error is expected and handled
        Error.captureStackTrace(this, this.constructor); // Captures the stack trace for debugging
    }
               
}
module.exports = AppError;