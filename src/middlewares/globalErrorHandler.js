"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const handleValidationError_1 = __importDefault(require("../errors/handleValidationError"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const handleZodError_1 = __importDefault(require("../errors/handleZodError"));
const zod_1 = require("zod");
const handleCastError_1 = __importDefault(require("../errors/handleCastError"));
const handleDuplicateError_1 = __importDefault(require("../errors/handleDuplicateError"));
const globalErrorHandler = (error, req, res, next) => {
    let statusCode = 500;
    let message = 'Something went wrong';
    let errorMessage = [];
    // For Validation error
    if (error.name === 'ValidationError') {
        const simplifiedError = (0, handleValidationError_1.default)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessage = simplifiedError.errorMessage;
    }
    else if (error instanceof zod_1.ZodError) {
        const zodErr = (0, handleZodError_1.default)(error);
        statusCode = zodErr.statusCode;
        message = zodErr.message;
        errorMessage = zodErr.errorMessage;
        // Wrong Mongoose Object ID Error
    }
    else if (error.name === 'CastError') {
        const simplifiedError = (0, handleCastError_1.default)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessage = simplifiedError.errorMessage;
        // Handling Mongoose duplicate key errors
    }
    else if (error.code === 11000) {
        const simplifiedError = (0, handleDuplicateError_1.default)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessage = simplifiedError.errorMessage;
    }
    else if (error instanceof ApiError_1.default) {
        statusCode = error?.statusCode;
        message = error?.message;
        errorMessage = error?.message
            ? [
                {
                    path: '',
                    message: error.message,
                },
            ]
            : [];
        // Handling wrong JWT error
    }
    else if (error.name === 'JsonWebTokenError') {
        statusCode = 400;
        message = 'JSON Web Token is invalid. Try Again!!!';
        errorMessage = message
            ? [
                {
                    path: '',
                    message: 'JSON Web Token is invalid. Try Again!!!',
                },
            ]
            : [];
        // for normal Error class
    }
    else if (error.name === 'TokenExpiredError') {
        statusCode = 400;
        message = 'JSON Web Token is expired. Try Again!!!';
        errorMessage = message
            ? [
                {
                    path: '',
                    message: 'JSON Web Token is expired. Try Again!!!',
                },
            ]
            : [];
        // for normal Error class
    }
    else if (error instanceof Error) {
        message = error?.message;
        errorMessage = error?.message
            ? [
                {
                    path: '',
                    message: error?.message,
                },
            ]
            : [];
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorMessage,
        stack: error.stack,
    });
};
exports.default = globalErrorHandler;
