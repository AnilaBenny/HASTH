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
exports.default = (dependecies) => {
    const { getConverstationsUseCase } = dependecies.useCase;
    const getConverstationsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id, role } = req.query;
            const data = {
                id, role
            };
            const response = yield getConverstationsUseCase(dependecies).executeFunction(data);
            if (response.status) {
                res.json({ status: true, data: response.data });
            }
            else {
                res.json({ status: false, message: "Data not found", data: [] });
            }
        }
        catch (error) {
            logger_1.default.error(error);
            res.status(500).json({ status: false, message: "Internal server error" });
        }
    });
    return getConverstationsController;
};
