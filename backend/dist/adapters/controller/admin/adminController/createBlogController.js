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
    const createBlogController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { CreateBlogUseCase } = dependencies.useCase;
            const image = req.file ? req.file.filename : null;
            const data = {
                title: req.body.title,
                image,
                content: req.body.content
            };
            const execute = yield CreateBlogUseCase(dependencies);
            const response = yield execute.executeFunction(data);
            if (response.status) {
                res.json({ status: true, data: response.data });
            }
            else {
                res.json({ status: false, message: response.message });
            }
        }
        catch (err) {
            console.error('createBlog');
        }
    });
    return createBlogController;
};
