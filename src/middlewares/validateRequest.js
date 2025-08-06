"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validateRequest = (zodSchema) => async (req, res, next) => {
    try {
        await zodSchema.parseAsync({ body: req.body,
            query: req.query,
            params: req.params,
            cookies: req.cookies,
        });
        return next();
    }
    catch (error) {
        next(error);
    }
};
exports.default = validateRequest;
