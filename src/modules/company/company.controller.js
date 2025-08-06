"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const company_service_1 = require("./company.service");
const catchAsyncErrors_1 = require("../../utils/catchAsyncErrors");
const companyCreate = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res) => {
    const { ...companyInfo } = req.body;
    const companyData = await company_service_1.CompanyServices.companyCreate(companyInfo, req.file);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Company Create Successfully',
        data: companyData,
    });
});
const getCompanyByCreator = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res) => {
    const companyData = await company_service_1.CompanyServices.getCompanyByCreator(req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Company Getting Successfully',
        data: companyData,
    });
});
const gettingCompnyNamesByCreator = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res) => {
    const companyData = await company_service_1.CompanyServices.gettingCompnyNamesByCreator(req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Compny Names Getting Successfully',
        data: companyData,
    });
});
exports.CompanyControllers = {
    companyCreate,
    getCompanyByCreator,
    gettingCompnyNamesByCreator,
};
