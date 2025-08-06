"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authentication_1 = require("../../middlewares/authentication");
const company_controller_1 = require("./company.controller");
const user_1 = require("../../enums/user");
const multerMiddleware_1 = __importDefault(require("../../middlewares/multerMiddleware"));
const router = express_1.default.Router();
router.post('/create', 
// isAuthenticated(),
// authorizeRoles(UserRole.EMPLOYER),
// validateRequest(CompanyValidation.companyValidationZodSchema),
multerMiddleware_1.default.single('logoImage'), company_controller_1.CompanyControllers.companyCreate);
router.get('/getCompanyByCreator', (0, authentication_1.isAuthenticated)(), (0, authentication_1.authorizeRoles)(user_1.UserRole.EMPLOYER), 
// validateRequest(CompanyValidation.companyValidationZodSchema),
company_controller_1.CompanyControllers.getCompanyByCreator);
router.get('/compnyNames', (0, authentication_1.isAuthenticated)(), (0, authentication_1.authorizeRoles)(user_1.UserRole.EMPLOYER), company_controller_1.CompanyControllers.gettingCompnyNamesByCreator);
exports.CompanyRoutes = router;
