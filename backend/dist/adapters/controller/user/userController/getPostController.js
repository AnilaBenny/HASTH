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
    const { getPostUseCase } = dependencies.useCase;
    const getPostController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const page = parseInt(req.query.page) || 1;
            const executeFunction = yield getPostUseCase(dependencies);
            console.log(executeFunction);
            const response = yield executeFunction.executeFunction(page);
            if (response && response.status) {
                return res.status(200).json({ status: true, data: response.data });
            }
            else {
                return res.status(404).json({ status: false, message: "Data not found" });
            }
        }
        catch (error) {
            console.error("Error in getPost Controller:", error);
            return res.status(500).json({ status: false, message: "Internal server error" });
        }
    });
    return getPostController;
};
