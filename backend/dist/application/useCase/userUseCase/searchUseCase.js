"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../../../logger"));
exports.default = (dependencies) => {
    const { userRespository } = dependencies.respository;
    const executeFunction = (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield userRespository.search(data);
            return { status: true, data: response };
        }
        catch (error) {
            logger_1.default.error("Error in search usecase:", error);
            return { status: false, message: "Error in search use case" };
        }
    });
    return { executeFunction: executeFunction };
};
