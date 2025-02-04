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
const nodemailer_1 = require("../../../utils/nodemailer");
exports.default = (dependencies) => {
    const { userRespository } = dependencies.respository;
    const executionFunction = (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email } = data;
            const userExists = yield userRespository.forgotPassword(email);
            console.log(userExists, '.....');
            if (!userExists.status) {
                return { status: false, data: 'User not find' };
            }
            const response = yield (0, nodemailer_1.sendOtp)(email);
            if (response.status) {
                return { status: true, data: response.otp };
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
    return {
        executionFunction: executionFunction
    };
};
