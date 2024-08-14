import { adminRespository,userRespository } from "../respository"
import { userRegistration,otpVerification ,forgotPasswordUseCase,loginUseCase,updatePasswordUseCase,
         resendOtpUseCase,updateProfileUseCase,googleRegisterUseCase,refreshTokenuseCase,postCreationUseCase,
         getPostUseCase,likedUseCase,commentCreationUseCase
       } from "../../application/useCase"
import { AdminloginUseCase,getallUseCase,handleUserBlockUseCase,verifyCreativeUseCase} from "../../application/useCase/adminUseCase"


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
    commentCreationUseCase:commentCreationUseCase
}
const respository:any={
    userRespository,
    adminRespository,
}
export default{
    useCase,
    respository
}