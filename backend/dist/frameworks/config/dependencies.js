"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const respository_1 = require("../respository");
const useCase_1 = require("../../application/useCase");
const adminUseCase_1 = require("../../application/useCase/adminUseCase");
const useCase = {
    userRegistration: useCase_1.userRegistration,
    otpVerification: useCase_1.otpVerification,
    loginVerification: useCase_1.loginUseCase,
    AdminloginUseCase: adminUseCase_1.AdminloginUseCase,
    getallUseCase: adminUseCase_1.getallUseCase,
    handleUserBlockUseCase: adminUseCase_1.handleUserBlockUseCase,
    forgotPasswordUseCase: useCase_1.forgotPasswordUseCase,
    updatePasswordUseCase: useCase_1.updatePasswordUseCase,
    resendOtpUseCase: useCase_1.resendOtpUseCase,
    updateProfileUseCase: useCase_1.updateProfileUseCase,
    googleRegisterUseCase: useCase_1.googleRegisterUseCase,
    refreshTokenuseCase: useCase_1.refreshTokenuseCase,
    verifyCreativeUseCase: adminUseCase_1.verifyCreativeUseCase,
    postCreationUseCase: useCase_1.postCreationUseCase,
    getPostUseCase: useCase_1.getPostUseCase,
    likedUseCase: useCase_1.likedUseCase,
    commentCreationUseCase: useCase_1.commentCreationUseCase,
    reportUseCase: useCase_1.reportUseCase,
    productCreationUseCase: useCase_1.productCreationUseCase,
    getCreatorUseCase: useCase_1.getCreatorUseCase,
    getProductsUseCase: useCase_1.getProductsUseCase,
    postEditUseCase: useCase_1.postEditUseCase,
    deletePostUseCase: useCase_1.deletePostUseCase,
    statusProductUseCase: useCase_1.statusProductUseCase,
    getallReportUseCase: adminUseCase_1.getallReportUseCase,
    productEditUseCase: useCase_1.productEditUseCase,
    commentReplyUseCase: useCase_1.commentReplyUseCase,
    pinCommentUseCase: useCase_1.pinCommentUseCase,
    addtocartUseCase: useCase_1.addtocartUseCase,
    deletecartItemUseCase: useCase_1.deletecartItemUseCase,
    orderUseCase: useCase_1.orderUseCase,
    sendMessegesUseCase: useCase_1.sendMessegesUseCase,
    allorderUseCase: useCase_1.allorderUseCase,
    createConverstationUseCase: useCase_1.createConverstationUseCase,
    getConverstationsUseCase: useCase_1.getConverstationsUseCase,
    getConverstationByIdUseCase: useCase_1.getConverstationByIdUseCase,
    sendImageUseCase: useCase_1.sendImageUseCase,
    sendAudioUseCase: useCase_1.sendAudioUseCase,
    getallOrderUseCase: adminUseCase_1.getallOrderUseCase,
    cancelOrderUseCase: useCase_1.cancelOrderUseCase,
    updatestatusUseCase: useCase_1.updatestatusUseCase,
    reviewUseCase: useCase_1.reviewUseCase,
    markMessagesAsReadUseCase: useCase_1.markMessagesAsReadUseCase,
    allListNumberUseCase: useCase_1.allListNumberUseCase,
    reviewEditUseCase: useCase_1.reviewEditUseCase,
    paymentStatusUseCase: useCase_1.paymentStatusUseCase,
    CreateBlogUseCase: adminUseCase_1.CreateBlogUseCase,
    getallBlogUseCase: adminUseCase_1.getallBlogUseCase,
    deleteBlogUseCase: adminUseCase_1.deleteBlogUseCase,
    searchUseCase: useCase_1.searchUseCase
};
const respository = {
    userRespository: respository_1.userRespository,
    adminRespository: respository_1.adminRespository,
};
exports.default = {
    useCase,
    respository
};
