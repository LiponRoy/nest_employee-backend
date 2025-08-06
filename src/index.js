"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./config"));
const app_1 = __importDefault(require("./app"));
let server;
//console.log(ab);
const main = async () => {
    try {
        // Mongodb connection
        await mongoose_1.default.connect(config_1.default.mongodb_url);
        console.log('Mongodb Connected');
        // Server creation
        server = app_1.default.listen(config_1.default.port, () => {
            console.log(`App listening on port -YES.  ${config_1.default.port}`);
        });
    }
    catch (error) {
        console.log(`Failed to connect database ${error}`);
    }
    //...........
};
main();
