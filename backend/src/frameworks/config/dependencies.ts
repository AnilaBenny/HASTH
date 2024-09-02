import { adminRespository,userRespository } from "../respository"
import { userRegistration,otpVerification ,forgotPasswordUseCase,loginUseCase,updatePasswordUseCase,
         resendOtpUseCase,updateProfileUseCase,googleRegisterUseCase,refreshTokenuseCase,postCreationUseCase,
         getPostUseCase,likedUseCase,commentCreationUseCase,reportUseCase,productCreationUseCase,
         getCreatorUseCase,getProductsUseCase,postEditUseCase,deletePostUseCase,statusProductUseCase,
         productEditUseCase,commentReplyUseCase,pinCommentUseCase,addtocartUseCase,deletecartItemUseCase,
         orderUseCase,sendMessegesUseCase,allorderUseCase,createConverstationUseCase,getConverstationsUseCase,
         getConverstationByIdUseCase,sendImageUseCase,sendAudioUseCase,cancelOrderUseCase,updatestatusUseCase,
         reviewUseCase
       } from "../../application/useCase"
import { AdminloginUseCase,getallUseCase,handleUserBlockUseCase,verifyCreativeUseCase,getallReportUseCase,
        getallOrderUseCase} from "../../application/useCase/adminUseCase"


const useCase:any={

    userRegistration: userRegistration,
    otpVerification:otpVerification,
    loginVerification:loginUseCase,
    AdminloginUseCase:AdminloginUseCase,
    getallUseCase:getallUseCase,
    handleUserBlockUseCase:handleUserBlockUseCase,
    forgotPasswordUseCase:forgotPasswordUseCase,
    updatePasswordUseCase:updatePasswordUseCase,
    resendOtpUseCase:resendOtpUseCase,
    updateProfileUseCase:updateProfileUseCase,
    googleRegisterUseCase:googleRegisterUseCase,
    refreshTokenuseCase:refreshTokenuseCase,
    verifyCreativeUseCase:verifyCreativeUseCase,
    postCreationUseCase:postCreationUseCase,
    getPostUseCase:getPostUseCase,
    likedUseCase:likedUseCase,
    commentCreationUseCase:commentCreationUseCase,
    reportUseCase:reportUseCase,
    productCreationUseCase:productCreationUseCase,
    getCreatorUseCase:getCreatorUseCase,
    getProductsUseCase:getProductsUseCase,
    postEditUseCase:postEditUseCase,
    deletePostUseCase:deletePostUseCase,
    statusProductUseCase:statusProductUseCase,
    getallReportUseCase:getallReportUseCase,
    productEditUseCase:productEditUseCase,
    commentReplyUseCase:commentReplyUseCase,
    pinCommentUseCase:pinCommentUseCase,
    addtocartUseCase:addtocartUseCase,
    deletecartItemUseCase:deletecartItemUseCase,
    orderUseCase:orderUseCase,
    sendMessegesUseCase:sendMessegesUseCase,
    allorderUseCase:allorderUseCase,
    createConverstationUseCase:createConverstationUseCase,
    getConverstationsUseCase:getConverstationsUseCase,
    getConverstationByIdUseCase:getConverstationByIdUseCase,
    sendImageUseCase:sendImageUseCase,
    sendAudioUseCase:sendAudioUseCase,
    getallOrderUseCase:getallOrderUseCase,
    cancelOrderUseCase:cancelOrderUseCase,
    updatestatusUseCase:updatestatusUseCase,
    reviewUseCase:reviewUseCase

}
const respository:any={
    userRespository,
    adminRespository,
}
export default{
    useCase,
    respository
}