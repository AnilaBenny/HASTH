"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const registrationController_1 = __importDefault(require("./registrationController"));
const otpController_1 = __importDefault(require("./otpController"));
const loginController_1 = __importDefault(require("./loginController"));
const forgotPasswordController_1 = __importDefault(require("./forgotPasswordController"));
const checkOtpController_1 = __importDefault(require("./checkOtpController"));
const updatePasswordController_1 = __importDefault(require("./updatePasswordController"));
const resendOtpController_1 = __importDefault(require("./resendOtpController"));
const updateProfileController_1 = __importDefault(require("./updateProfileController"));
const googleRegisterController_1 = __importDefault(require("./googleRegisterController"));
const refreshTokenController_1 = __importDefault(require("./refreshTokenController"));
const addInnovationController_1 = __importDefault(require("./addInnovationController"));
const getPostController_1 = __importDefault(require("./getPostController"));
const likedController_1 = __importDefault(require("./likedController"));
const commentController_1 = __importDefault(require("./commentController"));
const reportController_1 = __importDefault(require("./reportController"));
const addProductController_1 = __importDefault(require("./addProductController"));
const getProductsController_1 = __importDefault(require("./getProductsController"));
const getCreatorsController_1 = __importDefault(require("./getCreatorsController"));
const editPostController_1 = __importDefault(require("./editPostController"));
const editProductController_1 = __importDefault(require("./editProductController"));
const deletePostController_1 = __importDefault(require("./deletePostController"));
const statusProductController_1 = __importDefault(require("./statusProductController"));
const commentReplyController_1 = __importDefault(require("./commentReplyController"));
const pinCommentController_1 = __importDefault(require("./pinCommentController"));
const addtocartController_1 = __importDefault(require("./addtocartController"));
const removecartitemController_1 = __importDefault(require("./removecartitemController"));
const razorpayController_1 = __importDefault(require("./razorpayController"));
const orderController_1 = __importDefault(require("./orderController"));
const allorderController_1 = __importDefault(require("./allorderController"));
const allMessagesController_1 = __importDefault(require("./allMessagesController"));
const getConversationsController_1 = __importDefault(require("./getConversationsController"));
const createConverstationController_1 = __importDefault(require("./createConverstationController"));
const getConverstationByIdController_1 = __importDefault(require("./getConverstationByIdController"));
const updateOrderStatusController_1 = __importDefault(require("./updateOrderStatusController"));
const cancelOrderController_1 = __importDefault(require("./cancelOrderController"));
const reviewController_1 = __importDefault(require("./reviewController"));
const dialogflowController_1 = __importDefault(require("./dialogflowController"));
const markMessagesAsReadController_1 = __importDefault(require("./markMessagesAsReadController"));
const allListNumberController_1 = __importDefault(require("./allListNumberController"));
const reviewEditController_1 = __importDefault(require("./reviewEditController"));
const paymentStatusController_1 = __importDefault(require("./paymentStatusController"));
const searchController_1 = __importDefault(require("./searchController"));
exports.default = (dependencies) => {
    return {
        registrationController: (0, registrationController_1.default)(dependencies),
        otpController: (0, otpController_1.default)(dependencies),
        loginController: (0, loginController_1.default)(dependencies),
        forgotPasswordController: (0, forgotPasswordController_1.default)(dependencies),
        checkOtpController: (0, checkOtpController_1.default)(dependencies),
        updatePasswordController: (0, updatePasswordController_1.default)(dependencies),
        resendOtpController: (0, resendOtpController_1.default)(dependencies),
        updateProfileController: (0, updateProfileController_1.default)(dependencies),
        googleRegisterController: (0, googleRegisterController_1.default)(dependencies),
        refreshTokenController: (0, refreshTokenController_1.default)(dependencies),
        addInnovationController: (0, addInnovationController_1.default)(dependencies),
        getPostController: (0, getPostController_1.default)(dependencies),
        likedController: (0, likedController_1.default)(dependencies),
        commentController: (0, commentController_1.default)(dependencies),
        reportController: (0, reportController_1.default)(dependencies),
        addProductController: (0, addProductController_1.default)(dependencies),
        getProductsController: (0, getProductsController_1.default)(dependencies),
        getCreatorsController: (0, getCreatorsController_1.default)(dependencies),
        editPostController: (0, editPostController_1.default)(dependencies),
        editProductController: (0, editProductController_1.default)(dependencies),
        deletePostController: (0, deletePostController_1.default)(dependencies),
        statusProductController: (0, statusProductController_1.default)(dependencies),
        commentReplyController: (0, commentReplyController_1.default)(dependencies),
        pinCommentController: (0, pinCommentController_1.default)(dependencies),
        addtocartController: (0, addtocartController_1.default)(dependencies),
        removecartitemController: (0, removecartitemController_1.default)(dependencies),
        razorpayController: (0, razorpayController_1.default)(),
        orderController: (0, orderController_1.default)(dependencies),
        allorderController: (0, allorderController_1.default)(dependencies),
        allMessagesController: (0, allMessagesController_1.default)(dependencies),
        getConversationsController: (0, getConversationsController_1.default)(dependencies),
        createConverstationController: (0, createConverstationController_1.default)(dependencies),
        getConverstationByIdController: (0, getConverstationByIdController_1.default)(dependencies),
        updateOrderStatusController: (0, updateOrderStatusController_1.default)(dependencies),
        cancelOrderController: (0, cancelOrderController_1.default)(dependencies),
        reviewController: (0, reviewController_1.default)(dependencies),
        dialogflowController: (0, dialogflowController_1.default)(dependencies),
        markMessagesAsReadController: (0, markMessagesAsReadController_1.default)(dependencies),
        allListNumberController: (0, allListNumberController_1.default)(dependencies),
        reviewEditController: (0, reviewEditController_1.default)(dependencies),
        paymentStatusController: (0, paymentStatusController_1.default)(dependencies),
        searchController: (0, searchController_1.default)(dependencies)
    };
};
