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
exports.default = loginUseCase;
const utils_1 = require("../../../utils");
const generateToken_1 = __importDefault(require("../../../utils/generateToken"));
function loginUseCase(dependencies) {
    const { userRespository } = dependencies.respository;
    const executeFunction = (data) => __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield userRespository.finduser(data.email);
            if (response.status) {
                const user = response.user;
                const isPasswordCorrect = yield (0, utils_1.verifyHashPassword)(data.password, user.password);
                if (isPasswordCorrect) {
                    const token = yield (0, generateToken_1.default)({ userId: user._id });
                    return { status: true, data: user, token };
                }
                else {
                    return { status: false, message: 'Incorrect password' };
                }
            }
            else {
                return { status: false, message: response.message };
            }
        }
        catch (error) {
            console.error('Error in login verification use case:', error);
            return { status: false, message: 'Internal server error' };
        }
    });
    return { executeFunction };
}
