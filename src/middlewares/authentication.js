"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.isAuthenticated = void 0;
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const catchAsyncErrors_1 = require("../utils/catchAsyncErrors");
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const isAuthenticated = () => {
    return (0, catchAsyncErrors_1.catchAsyncError)(async (req, res, next) => {
        const token = req.cookies.authToken; // Get token from the cookie
        if (!token) {
            return res.status(401).json({ message: 'You are not login' });
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_auth_secret);
            req.user = decoded; // Add decoded info to request object
            // console.log(' req.user id ....:', req.user.userId);
            // console.log(' req.user role....:', req.user.userRole);
            next();
        }
        catch (error) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
    });
};
exports.isAuthenticated = isAuthenticated;
// Handling users roles
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.userRole)) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, `Role (${req.user.userRole}) is not allowed to acccess this resource`);
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
