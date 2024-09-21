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
            console.log(req.body._id);
            const { postEditUseCase } = dependencies.useCase;
            const { _id, caption, tags, existingImages, existingVideo } = req.body;
            const postId = _id;
            let images = existingImages;
            let video = existingVideo;
            const multerReq = req;
            if (multerReq.files) {
                if (multerReq.files['images']) {
                    const newImages = multerReq.files['images'].map(file => file.filename);
                    images = [...images, ...newImages];
                }
                if (multerReq.files['video'] && multerReq.files['video'].length > 0) {
                    video = multerReq.files['video'][0].filename;
                }
            }
            const data = {
                postId,
                caption,
                images,
                video,
                tags,
            };
            const executeFunction = yield postEditUseCase(dependencies);
            const response = yield executeFunction.executeFunction(data);
            if (response.status) {
                return res.status(200).json({ status: true, data: response.data });
            }
            else {
                return res.status(400).json({ status: false, message: response.message });
            }
        }
        catch (error) {
            console.error('Error in post edit controller:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    });
    return postEditController;
};
