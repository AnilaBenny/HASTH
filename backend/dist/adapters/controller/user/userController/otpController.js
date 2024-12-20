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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../../../../logger"));
exports.default = (dependencies) => {
    const { otpVerification } = dependencies.useCase;
    const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { otp } = req.body;
        const userData = req.cookies.userData;
        logger_1.default.info('Entered OTP:', otp, req.cookies.otp);
        if (req.cookies.otp === otp) {
            try {
                const executionFunction = yield otpVerification(dependencies);
                const response = yield executionFunction.executionFunction(userData);
                if (response.status) {
                    logger_1.default.info(response.data);
                    const _a = response.data.toObject
                        ? response.data.toObject()
                        : response.data, { password } = _a, sanitizedData = __rest(_a, ["password"]);
                    res.json({ status: true, data: response.sanitizedData });
                }
                else {
                    res.json({ status: false, message: 'Verification failed' });
                }
            }
            catch (error) {
                logger_1.default.error('Error in OTP verification:', error);
                res.status(500).json({ status: false, message: 'Internal server error' });
            }
        }
        else {
            logger_1.default.warn('wrong otp');
            res.status(400).json({ status: false, message: 'Wrong OTP' });
        }
    });
    return verifyOtp;
};
