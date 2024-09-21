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
    const { handleUserBlockUseCase } = dependencies.useCase;
    const handleUserBlockController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId } = req.params;
            console.log(userId, '....userId');
            const executeFunction = yield handleUserBlockUseCase(dependencies);
            const response = yield executeFunction.executeFunction(userId);
            console.log(response, '....res');
            if (response && response.status) {
                res.clearCookie('accessToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
                res.clearCookie('refreshToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
                res.json({ status: true, data: response.data });
            }
            else {
                res.status(400).json({ status: false, message: response.message || "User blocking/unblocking failed" });
            }
        }
        catch (error) {
            console.error("Error in handleUserBlockController:", error);
            res.status(500).json({ status: false, message: "Internal server error" });
        }
    });
    return handleUserBlockController;
};
