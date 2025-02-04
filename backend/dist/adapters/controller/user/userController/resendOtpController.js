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
exports.default = (dependencies) => {
    const { resendOtpUseCase } = dependencies.useCase;
    const resendController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email } = req.body;
            const executionFunction = yield resendOtpUseCase(dependencies);
            const response = yield executionFunction.executionFunction(email);
            if (response.status) {
                res.cookie('otp', response.data, {
                    maxAge: 60000,
                    secure: true,
                    sameSite: 'none'
                });
                console.log(response);
                res.json({ status: true, data: response.data });
            }
            else {
                res.json({ status: false, data: response.data });
            }
        }
        catch (error) {
            console.error('Error in resend otp controller:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
    return resendController;
};
