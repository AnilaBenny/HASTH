import registrationController from './registrationController'
import otpController from './otpController'
import loginController from './loginController'
export default (dependencies:any)=>{
return{
    registrationController:registrationController(dependencies),
    otpController:otpController(dependencies),
    loginController:loginController(dependencies),
}
}