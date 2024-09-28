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
    const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { otp } = req.body;
            console.log('Entered OTP:', otp, req.session.otp);
            if (req.session.otp === otp) {
                res.json({ status: true, message: 'Otp verified' });
            }
            else {
                res.json({ status: false, message: 'Verification failed' });
            }
        }
        catch (error) {
            console.error('Error in OTP verification:', error);
            res.status(500).json({ status: false, message: 'Internal server error' });
        }
    });
    return verifyOtp;
};
