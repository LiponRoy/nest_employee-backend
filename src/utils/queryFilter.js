"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const queryFilter = (obj, Keys) => {
    const finalObj = {};
    for (const key of Keys) {
        if (obj && Object.hasOwnProperty.call(obj, key)) {
            finalObj[key] = obj[key];
        }
    }
    return finalObj;
};
exports.default = queryFilter;
