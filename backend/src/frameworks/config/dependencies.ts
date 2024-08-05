import { adminRespository,userRespository,creativeRespository } from "../respository"
import { userRegistration,otpVerification } from "../../application/useCase"


const useCase:any={

    userRegistration: userRegistration,
    otpVerification:otpVerification,

}
const respository:any={
    userRespository,
    adminRespository,
    creativeRespository
}
export default{
    useCase,
    respository
}