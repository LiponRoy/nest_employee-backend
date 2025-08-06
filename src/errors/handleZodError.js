"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleZodError = (err) => {
    const errorZod = err.issues.map((issue) => {
        return {
            // pick second element of path array, that is why= issue?.path[1],
            path: issue?.path[1],
            message: issue?.message,
        };
    });
    const pth = errorZod.map((v) => v.path);
    const message = errorZod.map((v) => v.message).toString();
    return {
        statusCode: 400,
        message: 'Zod Error- ' + message,
        errorMessage: pth,
    };
};
exports.default = handleZodError;
