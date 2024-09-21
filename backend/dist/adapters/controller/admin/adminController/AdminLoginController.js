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
const generateToken_1 = __importDefault(require("../../../../utils/generateToken"));
exports.default = (dependencies) => {
    const AdminLoginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const { AdminloginUseCase } = dependencies.useCase;
            const data = {
                email, password
            };
            const execute = yield AdminloginUseCase(dependencies);
            const response = yield execute.executeFunction(data);
            if (response.status) {
                const token = yield (0, generateToken_1.default)(data);
                res.json({ status: true, data: response, accessToken: response.accessToken });
            }
            else {
                res.json({ status: false, message: response.message });
            }
        }
        catch (err) {
            console.log(err);
        }
    });
    return AdminLoginController;
};
