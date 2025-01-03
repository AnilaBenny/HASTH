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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../../../../logger"));
exports.default = (dependencies) => {
    const { cancelOrderUseCase } = dependencies.useCase;
    const cancelOrderController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const executeFunction = yield cancelOrderUseCase(dependencies);
            const response = yield executeFunction.executeFunction(req.body);
            if (response && response.status) {
                res.json({ status: true, data: response.data });
            }
            else {
                res.status(400).json({ status: false, message: response.message || "order cancellation failed" });
            }
        }
        catch (error) {
            logger_1.default.error("Error in cancelOrderController:", error);
            res.status(500).json({ status: false, message: "Internal server error" });
        }
    });
    return cancelOrderController;
};
