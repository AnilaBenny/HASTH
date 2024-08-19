import AdminLoginController from "./AdminLoginController";
import getAllUserController from "./getAllUserController";
import handleUserBlockController from "./handleUserBlockController";
import verifyCreativeController from "./verifyCreativeController";
import getReportsController from "./getReportsController";
export default(dependencies:any)=>{
    return{
        AdminLoginController:AdminLoginController(dependencies),
        getAllUserController:getAllUserController(dependencies),
        handleUserBlockController:handleUserBlockController(dependencies),
        verifyCreativeController:verifyCreativeController(dependencies),
        getReportsController:getReportsController(dependencies)
    }
    
}
    



