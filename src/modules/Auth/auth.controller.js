"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const config_1 = __importDefault(require("../../config"));
const catchAsyncErrors_1 = require("../../utils/catchAsyncErrors");
const auth_service_1 = require("./auth.service");
const signupUser = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res) => {
    const { ...user } = req.body;
    const newUser = await auth_service_1.AuthServices.signupUser(user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User Registered Successfully',
        data: newUser,
    });
});
const loginUser = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res) => {
    const result = await auth_service_1.AuthServices.loginUser(req.body);
    const { authToken, user } = result;
    res.cookie('authToken', authToken, {
        secure: config_1.default.node_env === 'production',
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 365,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User is logged in successfully!',
        data: {
            user,
            authToken,
        },
    });
});
const logout = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res) => {
    //res.clearCookie('refressToken');
    res.cookie('authToken', null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User Logged out',
        data: [],
    });
});
const profile = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res) => {
    const { userId } = req.user;
    const result = await auth_service_1.AuthServices.profile(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Profile is retrieved successfully',
        data: result,
    });
});
exports.AuthControllers = {
    signupUser,
    loginUser,
    logout,
    profile,
};
