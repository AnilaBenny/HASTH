import { adminRespository,userRespository } from "../respository"
import { userRegistration,otpVerification ,forgotPasswordUseCase,loginUseCase,updatePasswordUseCase} from "../../application/useCase"
import { AdminloginUseCase,getallUseCase,handleUserBlockUseCase} from "../../application/useCase/adminUseCase"


const useCase:any={

    userRegistration: userRegistration,
    otpVerification:otpVerification,
    loginVerification:loginUseCase,
    AdminloginUseCase:AdminloginUseCase,
    getallUseCase:getallUseCase,
    handleUserBlockUseCase:handleUserBlockUseCase,
    forgotPasswordUseCase:forgotPasswordUseCase,
    updatePasswordUseCase:updatePasswordUseCase
}
const respository:any={
    userRespository,
    adminRespository,
}
export default{
    useCase,
    respository
}