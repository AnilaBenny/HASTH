"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRespository = exports.userRespository = void 0;
const userRespository_1 = __importDefault(require("./userRespository"));
exports.userRespository = userRespository_1.default;
const adminRespository_1 = __importDefault(require("./adminRespository"));
exports.adminRespository = adminRespository_1.default;
