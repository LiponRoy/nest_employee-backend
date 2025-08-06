"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyValidation = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
const companyValidationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .min(2, { message: 'Name must be at least 2 characters long' }),
        description: zod_1.z
            .string()
            .min(1, { message: 'Name must be at least 1 characters long' }),
        website: zod_1.z
            .string()
            .min(1, { message: 'Name must be at least 1 characters long' }),
        location: zod_1.z
            .string()
            .min(1, { message: 'Name must be at least 1 characters long' }),
        creator: zod_1.z.string().refine((val) => mongoose_1.Types.ObjectId.isValid(val), {
            message: 'Invalid userId format',
        }),
    }),
});
exports.CompanyValidation = {
    companyValidationZodSchema,
};
