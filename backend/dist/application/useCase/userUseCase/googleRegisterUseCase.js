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
exports.default = googleRegisterUseCase;
const generateToken_1 = __importDefault(require("../../../utils/generateToken"));
function googleRegisterUseCase() {
    const executeFunction = (data) => __awaiter(this, void 0, void 0, function* () {
        try {
            const token = yield (0, generateToken_1.default)(data);
            if (token) {
                return { status: true, data: token };
            }
            else {
                return { status: false, message: "User registration failed" };
            }
        }
        catch (error) {
            console.error('Error in Google register use case:', error);
            return { status: false, message: 'Internal Server Error' };
        }
    });
    return { executeFunction };
}
