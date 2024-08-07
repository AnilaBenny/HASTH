import registrationController from './registrationController'
import otpController from './otpController'
import loginController from './loginController'
import forgotPasswordController from './forgotPasswordController'
import checkOtpController from './checkOtpController'
import updatePasswordController from './updatePasswordController'
import resendOtpController from './resendOtpController'
import updateProfileController from './updateProfileController'
export default (dependencies:any)=>{
return{
    registrationController:registrationController(dependencies),
    otpController:otpController(dependencies),
    loginController:loginController(dependencies),
    forgotPasswordController:forgotPasswordController(dependencies),
    checkOtpController:checkOtpController(dependencies),
    updatePasswordController:updatePasswordController(dependencies),
    resendOtpController:resendOtpController(dependencies),
    updateProfileController:updateProfileController(dependencies)
}
}