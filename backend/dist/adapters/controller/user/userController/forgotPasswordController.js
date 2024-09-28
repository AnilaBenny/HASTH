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
    const { forgotPasswordUseCase } = dependencies.useCase;
    const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log(req.body);
            const { email } = req.body;
            const data = {
                email
            };
            const executionFunction = yield forgotPasswordUseCase(dependencies);
            const response = yield executionFunction.executionFunction(data);
            console.log(response, '........');
            if (response.status) {
                res.cookie('otp', response.data, {
                    maxAge: 60000,
                    secure: true,
                    sameSite: 'none'
                });
                res.json({ status: true, data: response.data });
            }
            else {
                res.json({ status: false, data: response.data });
            }
        }
        catch (error) {
            console.error('Error in forgot password controller:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
    return forgotPassword;
};
