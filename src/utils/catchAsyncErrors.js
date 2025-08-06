"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAsyncError = void 0;
const catchAsyncError = (func) => (req, res, next) => Promise.resolve(func(req, res, next)).catch(next);
exports.catchAsyncError = catchAsyncError;
