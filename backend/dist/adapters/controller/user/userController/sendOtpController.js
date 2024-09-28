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
const utils_1 = require("../../../../utils");
exports.default = (dependencies) => {
    const searchController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield (0, utils_1.sendOtp)(req.body.email);
            if (response) {
                console.log(response, 'rs...');
                res.cookie('otp', response.otp, {
                    maxAge: 60000,
                    secure: true,
                    sameSite: 'none'
                });
                res.json({ status: true });
            }
            else {
                res.status(400).json("otp send failed");
            }
        }
        catch (error) {
            console.error("Error in otp sendController:", error);
            res.status(500).json({ status: false, message: "Internal server error" });
        }
    });
    return searchController;
};
