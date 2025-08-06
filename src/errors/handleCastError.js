"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleCastError = (err) => {
    //console.log('Cast Err......', err);
    const castErr = [
        {
            path: `Invalid.${err?.path}:${err?.value}`,
            message: err?.message,
        },
    ];
    const statusCode = 400;
    return {
        statusCode,
        message: 'Invalid ID [Cast Error]',
        errorMessage: castErr,
    };
};
exports.default = handleCastError;
