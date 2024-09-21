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
    const { refreshTokenUsecase } = dependencies.useCase;
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const refreshToken = req.cookies['refreshToken'];
            if (!refreshToken) {
                return res.status(401).json({ status: false, message: 'No refresh token provided' });
            }
            const response = yield refreshTokenUsecase(dependencies).executeFunction(refreshToken);
            if (!response.status) {
                return res.status(403).json({ status: false, message: response.message });
            }
            res.cookie('refreshToken', response.data.refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
            return res.json({ accessToken: response.data.accessToken });
        }
        catch (error) {
            console.error('Error in refreshTokenController:', error);
            return res.status(500).json({ status: false, message: 'Internal Server Error' });
        }
    });
};
