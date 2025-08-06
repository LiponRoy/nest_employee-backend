"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const globalErrorHandler_1 = __importDefault(require("./middlewares/globalErrorHandler"));
const notFound_1 = __importDefault(require("./middlewares/notFound"));
const config_1 = __importDefault(require("./config"));
const app = (0, express_1.default)();
//parsers
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
//middlewares
// app.use(cors());
app.use((0, cors_1.default)({
    origin: config_1.default.frontend_URL,
    credentials: true, // Allow cookies
}));
app.use(express_1.default.urlencoded({ extended: true }));
// application routes
app.use('/api/v1', routes_1.default);
// Testing
app.get('/', (req, res, next) => {
    res.send('Hi Nest Employee...');
});
// error middleware ...
app.use(globalErrorHandler_1.default);
// Not found error middleware
app.use(notFound_1.default);
exports.default = app;
