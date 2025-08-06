"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authentication_1 = require("../../middlewares/authentication");
const profile_controller_1 = require("./profile.controller");
const multerMiddleware_1 = __importDefault(require("../../middlewares/multerMiddleware"));
const router = express_1.default.Router();
router.put('/updateGeneralInfo', (0, authentication_1.isAuthenticated)(), multerMiddleware_1.default.single('pdf_cloudinary_url'), profile_controller_1.profileControllers.generalInfoUpdate);
router.put('/updateSkills', (0, authentication_1.isAuthenticated)(), profile_controller_1.profileControllers.updateSkills);
router.put('/updateEducation', (0, authentication_1.isAuthenticated)(), profile_controller_1.profileControllers.updateEducation);
router.put('/updateExperience', (0, authentication_1.isAuthenticated)(), profile_controller_1.profileControllers.updateExperience);
router.get('/profileDataById/', (0, authentication_1.isAuthenticated)(), profile_controller_1.profileControllers.getProfileDataById);
router.get('/educationDataByLoginUser/', (0, authentication_1.isAuthenticated)(), profile_controller_1.profileControllers.getEducationData);
router.get('/generalInfoDataByLoginUser/', (0, authentication_1.isAuthenticated)(), profile_controller_1.profileControllers.getGeneralInfoData);
exports.profileRoutes = router;
