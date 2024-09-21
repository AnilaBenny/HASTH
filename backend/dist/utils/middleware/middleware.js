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
exports.middleware = void 0;
const generateToken_1 = require("../generateToken");
const middleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authorizationHeader = req.headers.authorization;
    console.log(authorizationHeader, 'authorization....////');
    const token = authorizationHeader === null || authorizationHeader === void 0 ? void 0 : authorizationHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ status: false, message: 'No token provided' });
    }
    try {
        const decoded = yield (0, generateToken_1.verifyToken)(token);
        console.log(decoded, 'decoded');
        req.user = {
            userId: decoded.userId,
            role: decoded.role
        };
        console.log(req.user);
        if (decoded.role === 'admin') {
            console.log('Admin access granted');
        }
        else if (decoded.role === 'user') {
            console.log('User access granted');
        }
        else {
            return res.status(403).json({ status: false, message: 'Forbidden: Insufficient rights' });
        }
        next();
    }
    catch (error) {
        return res.status(401).json({ status: false, message: 'Invalid or expired token' });
    }
});
exports.middleware = middleware;
