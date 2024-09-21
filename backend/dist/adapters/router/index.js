"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const authenticationRouter_1 = __importDefault(require("./authenticationRouter"));
const express_1 = __importDefault(require("express"));
const routes = (dependencies) => {
    const router = express_1.default.Router();
    router.use('/auth', (0, authenticationRouter_1.default)(dependencies));
    return router;
};
exports.routes = routes;
