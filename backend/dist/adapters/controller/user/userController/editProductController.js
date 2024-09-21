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
    const postEditController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { productEditUseCase } = dependencies.useCase;
            // Log the incoming request body
            console.log('Request body:', req.body);
            // Check if req.body and req.body.data exist
            if (!req.body || !req.body.data) {
                return res.status(400).json({ status: false, message: 'Invalid request data' });
            }
            const existingProduct = req.body.data;
            if (!existingProduct) {
                return res.status(404).json({ status: false, message: 'Product not found' });
            }
            let images = existingProduct.images || [];
            const multerReq = req;
            if (multerReq.files && multerReq.files['images']) {
                const uploadedImages = multerReq.files['images'].map(file => file.filename);
                images = [...images, ...uploadedImages];
            }
            const data = Object.assign(Object.assign({ productId: existingProduct._id }, req.body), { images });
            console.log('Data for use case:', data);
            const executeFunction = productEditUseCase(dependencies);
            const response = yield executeFunction.executeFunction(data);
            if (response.status) {
                return res.status(200).json({ status: true, data: response.data });
            }
            else {
                return res.status(400).json({ status: false, message: response.message });
            }
        }
        catch (error) {
            console.error('Error in product edit controller:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    });
    return postEditController;
};
