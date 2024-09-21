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
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../../utils");
exports.default = (dependencies) => {
    const { userRespository } = dependencies.respository;
    const executeFunction = (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, newPassword } = data;
            const password = yield (0, utils_1.hashPassword)(newPassword);
            const response = yield userRespository.updatePassword({ email, password });
            if (response.status) {
                return { status: true, message: 'Password updated' };
            }
            else {
                return { status: false, data: response.message };
            }
        }
        catch (error) {
            console.error('Error in forgot password use case:', error);
            return { status: false, message: 'Internal server error' };
        }
    });
    return { executeFunction: executeFunction };
};
