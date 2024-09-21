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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (dependecies) => {
    const { loginVerification } = dependecies.useCase;
    const loginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password } = req.body;
        const data = {
            email,
            password,
        };
        const responce = yield loginVerification(dependecies).executeFunction(data);
        if (responce.status) {
            res.cookie('accessToken', responce.token.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 30 * 60 * 1000
            });
            res.cookie('refreshToken', responce.token.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 30 * 24 * 60 * 60 * 1000
            });
            const _a = responce.data.toObject
                ? responce.data.toObject()
                : responce.data, { password } = _a, sanitizedData = __rest(_a, ["password"]);
            return res.status(200).json({ status: true, data: sanitizedData, accessToken: responce.token.accessToken });
        }
        else {
            res.json({ status: false, message: responce.message });
        }
    });
    return loginController;
};
