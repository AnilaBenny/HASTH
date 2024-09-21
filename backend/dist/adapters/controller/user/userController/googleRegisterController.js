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
exports.default = googleRegisterController;
function googleRegisterController(dependencies) {
    const { googleRegisterUseCase } = dependencies.useCase;
    if (!googleRegisterUseCase) {
        throw new Error("googleRegisterUseCase is not defined in dependencies");
    }
    const googleRegisterController = (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.user) {
                console.log('Authentication failed: req.user is undefined');
                return res.status(401).json({ message: 'Authentication failed' });
            }
            console.log('Authenticated user:', req.user);
            const response = yield googleRegisterUseCase(dependencies).executeFunction(req.user);
            console.log('Use case response:', response);
            if (response.status) {
                res.cookie('accessToken', response.data.accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 30 * 60 * 1000
                });
                res.cookie('refreshToken', response.data.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 30 * 24 * 60 * 60 * 1000
                });
                const encodedToken = encodeURIComponent(response.data);
                return res.redirect(`http://localhost:5173/register?status=true&user=${encodeURIComponent(JSON.stringify(req.user))}&token=${encodedToken}`);
            }
            else {
                return res.redirect('http://localhost:5173/register?status=false');
            }
        }
        catch (error) {
            console.error("Error in Google register controller:", error);
            return res.status(500).json({ status: false, message: "Internal Server Error" });
        }
    });
    return googleRegisterController;
}
