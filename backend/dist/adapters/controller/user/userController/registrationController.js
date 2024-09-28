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
const utils_1 = require("../../../../utils");
const logger_1 = __importDefault(require("../../../../logger"));
require("express-session");
exports.default = (dependencies) => {
    const { userRegistration } = dependencies.useCase;
    const registerController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, email, password, mobile, skills, education, specification, street, city, state, zipCode, role } = req.body;
            const hashedPassword = yield (0, utils_1.hashPassword)(password);
            const data = {
                name,
                email,
                password: hashedPassword,
                mobile,
                skills,
                education,
                specification,
                street,
                city,
                state,
                zipCode,
                role,
            };
            req.session.userData = data;
            console.log(req.session.userData, 'session');
            const executionFunction = yield userRegistration(dependencies);
            const response = yield executionFunction.executionFunction(data);
            console.log(response, 'resp in registr');
            if (response.status) {
                req.session.otp = response.data;
                logger_1.default.info(response);
                res.json({ status: true, data: response.data });
            }
            else {
                res.json({ status: false, data: response.data });
            }
        }
        catch (error) {
            logger_1.default.error('Error in registration controller:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
    return registerController;
};
