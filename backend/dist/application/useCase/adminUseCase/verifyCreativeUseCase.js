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
    const { adminRespository } = dependencies.respository;
    const executeFunction = (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield adminRespository.verifyCreative(userId);
            if (response.status) {
                return { status: true, data: response.data };
            }
            else {
                return { status: false, message: response.message || "Creative Verification failed" };
            }
        }
        catch (error) {
            console.error("Error in verifyCreativeUseCase:", error);
            return { status: false, message: "Error in verifyCreativeUseCase" };
        }
    });
    return { executeFunction: executeFunction };
};
