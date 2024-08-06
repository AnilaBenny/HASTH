import { adminRespository,userRespository } from "../respository"
import { userRegistration,otpVerification } from "../../application/useCase"
import loginUseCase from "../../application/useCase/userUseCase/loginUseCase"
import { AdminloginUseCase,getallUseCase,handleUserBlockUseCase} from "../../application/useCase/adminUseCase"


const useCase:any={

    userRegistration: userRegistration,
    otpVerification:otpVerification,
    loginVerification:loginUseCase,
    AdminloginUseCase:AdminloginUseCase,
    getallUseCase:getallUseCase,
    handleUserBlockUseCase:handleUserBlockUseCase
}
const respository:any={
    userRespository,
    adminRespository,
}
export default{
    useCase,
    respository
}