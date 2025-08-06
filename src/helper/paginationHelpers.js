"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginetionHelpers = void 0;
const calculatePaginetion = (options) => {
    //console.log('cal paginetions--', options);
    const page = Number(options.page || 1);
    const limit = Number(options.limit || 10);
    const skip = (page - 1) * limit;
    //sorting
    const sortBy = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder || 'desc';
    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder,
    };
};
exports.paginetionHelpers = {
    calculatePaginetion,
};
