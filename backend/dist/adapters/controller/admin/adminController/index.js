"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AdminLoginController_1 = __importDefault(require("./AdminLoginController"));
const getAllUserController_1 = __importDefault(require("./getAllUserController"));
const handleUserBlockController_1 = __importDefault(require("./handleUserBlockController"));
const verifyCreativeController_1 = __importDefault(require("./verifyCreativeController"));
const getReportsController_1 = __importDefault(require("./getReportsController"));
const getallOrdersController_1 = __importDefault(require("./getallOrdersController"));
const createBlogController_1 = __importDefault(require("./createBlogController"));
const allBlogController_1 = __importDefault(require("./allBlogController"));
const deleteBlogController_1 = __importDefault(require("./deleteBlogController"));
exports.default = (dependencies) => {
    return {
        AdminLoginController: (0, AdminLoginController_1.default)(dependencies),
        getAllUserController: (0, getAllUserController_1.default)(dependencies),
        handleUserBlockController: (0, handleUserBlockController_1.default)(dependencies),
        verifyCreativeController: (0, verifyCreativeController_1.default)(dependencies),
        getReportsController: (0, getReportsController_1.default)(dependencies),
        getallOrdersController: (0, getallOrdersController_1.default)(dependencies),
        createBlogController: (0, createBlogController_1.default)(dependencies),
        allBlogController: (0, allBlogController_1.default)(dependencies),
        deleteBlogController: (0, deleteBlogController_1.default)(dependencies)
    };
};
