import registrationController from './registrationController'
import otpController from './otpController'
import loginController from './loginController'
import forgotPasswordController from './forgotPasswordController'
import checkOtpController from './checkOtpController'
import updatePasswordController from './updatePasswordController'
import resendOtpController from './resendOtpController'
import updateProfileController from './updateProfileController'
import googleRegisterController from './googleRegisterController'
import refreshTokenController from './refreshTokenController';
import addInnovationController from './addInnovationController';
import getPostController from './getPostController';
import likedController from './likedController';
import commentController from './commentController';
import reportController from './reportController';
import addProductController from './addProductController';
import getProductsController from './getProductsController';
import getCreatorsController from './getCreatorsController';
import editPostController from './editPostController';
import editProductController from './editProductController';
import deletePostController from './deletePostController';
import statusProductController from './statusProductController';
import commentReplyController from './commentReplyController';
import pinCommentController from './pinCommentController';
import addtocartController from './addtocartController';
import removecartitemController from './removecartitemController';
import razorpayController from './razorpayController';
import orderController from './orderController';
import allorderController from './allorderController';
import allMessagesController from './allMessagesController';
import getConversationsController from './getConversationsController';
import createConverstationController from './createConverstationController';
import getConverstationByIdController from './getConverstationByIdController';
import updateOrderStatusController from './updateOrderStatusController';
import cancelOrderController from './cancelOrderController';
import reviewController from './reviewController';
import dialogflowController from './dialogflowController';
import markMessagesAsReadController from './markMessagesAsReadController';
import allListNumberController from './allListNumberController';
import reviewEditController from './reviewEditController';
import paymentStatusController from './paymentStatusController';
import searchController from './searchController';
export default (dependencies:any)=>{
return{
    registrationController:registrationController(dependencies),
    otpController:otpController(dependencies),
    loginController:loginController(dependencies),
    forgotPasswordController:forgotPasswordController(dependencies),
    checkOtpController:checkOtpController(dependencies),
    updatePasswordController:updatePasswordController(dependencies),
    resendOtpController:resendOtpController(dependencies),
    updateProfileController:updateProfileController(dependencies),
    googleRegisterController:googleRegisterController(dependencies),
    refreshTokenController:refreshTokenController(dependencies),
    addInnovationController:addInnovationController(dependencies),
    getPostController:getPostController(dependencies),
    likedController:likedController(dependencies),
    commentController:commentController(dependencies),
    reportController:reportController(dependencies),
    addProductController:addProductController(dependencies),
    getProductsController:getProductsController(dependencies),
    getCreatorsController:getCreatorsController(dependencies),
    editPostController:editPostController(dependencies),
    editProductController:editProductController(dependencies),
    deletePostController:deletePostController(dependencies),
    statusProductController:statusProductController(dependencies),
    commentReplyController:commentReplyController(dependencies),
    pinCommentController:pinCommentController(dependencies),
    addtocartController:addtocartController(dependencies),
    removecartitemController:removecartitemController(dependencies),
    razorpayController:razorpayController(),
    orderController:orderController(dependencies),
    allorderController:allorderController(dependencies),
    allMessagesController:allMessagesController(dependencies),
    getConversationsController:getConversationsController(dependencies),
    createConverstationController:createConverstationController(dependencies),
    getConverstationByIdController:getConverstationByIdController(dependencies),
    updateOrderStatusController:updateOrderStatusController(dependencies),
    cancelOrderController:cancelOrderController(dependencies),
    reviewController:reviewController(dependencies),
    dialogflowController:dialogflowController(dependencies),
    markMessagesAsReadController:markMessagesAsReadController(dependencies),
    allListNumberController:allListNumberController(dependencies),
    reviewEditController:reviewEditController(dependencies),
    paymentStatusController:paymentStatusController(dependencies),
    searchController:searchController(dependencies)

}
}