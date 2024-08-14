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
    commentController:commentController(dependencies)
}
}