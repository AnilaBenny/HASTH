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
    const { orderUseCase } = dependencies.useCase;
    const orderController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const executionFunction = yield orderUseCase(dependencies);
            const response = yield executionFunction.executionFunction(req.body);
            if (response.status) {
                res.json({ status: true, data: response.data });
            }
            else {
                res.json({ status: false });
            }
        }
        catch (error) {
            logger_1.default.error('Error in order controller:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
    return orderController;
};
