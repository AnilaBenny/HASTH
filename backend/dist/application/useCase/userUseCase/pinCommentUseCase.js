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
    const { userRespository } = dependencies.respository;
    const executeFunction = (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield userRespository.pinunpinComment(data);
            console.log(response);
            if (response.status) {
                return { status: true, data: response.data };
            }
            else {
                return { status: false, message: response.message || "pin or unpin failed " };
            }
        }
        catch (error) {
            console.error("Error in pin unpin Comment usecase:", error);
            return { status: false, message: "Error in  pinunpinComment use case" };
        }
    });
    return { executeFunction: executeFunction };
};
