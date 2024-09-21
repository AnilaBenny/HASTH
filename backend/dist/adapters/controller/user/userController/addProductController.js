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
    const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { productCreationUseCase } = dependencies.useCase;
            let images = [];
            const multerReq = req;
            if (multerReq.files) {
                if (multerReq.files['images']) {
                    images = multerReq.files['images'].map(file => file.filename);
                }
            }
            const data = Object.assign(Object.assign({}, req.body), { images });
            const executeFunction = yield productCreationUseCase(dependencies);
            console.log(executeFunction);
            const response = yield executeFunction.executeFunction(data);
            if (response.status) {
                return res.status(200).json({ status: true, data: response.data });
            }
            else {
                return res.status(400).json({ status: false, data: response.data });
            }
        }
        catch (error) {
            logger_1.default.error('Error in product creation controller:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    });
    return addProduct;
};
