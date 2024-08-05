import registrationController from './registrationController'
import otpController from './otpController'
export default (dependencies:any)=>{
return{
    registrationController:registrationController(dependencies),
    otpController:otpController(dependencies),
}
}