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
    const commentCreationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { commentCreationUseCase } = dependencies.useCase;
            const { userId, postId, text } = req.body;
            const data = {
                userId,
                postId,
                text
            };
            const executeFunction = yield commentCreationUseCase(dependencies);
            console.log(executeFunction);
            const response = yield executeFunction.executeFunction(data);
            console.log('response', response);
            if (response.status) {
                return res.status(200).json({ status: true, data: response.data });
            }
            else {
                return res.status(400).json({ status: false, data: response.data });
            }
        }
        catch (error) {
            console.error('Error in comment creation controller:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    });
    return commentCreationController;
};
