import AdminLoginController from "./AdminLoginController";
import getAllUserController from "./getAllUserController";
import handleUserBlockController from "./handleUserBlockController";
export default(dependencies:any)=>{
    return{
        AdminLoginController:AdminLoginController(dependencies),
        getAllUserController:getAllUserController(dependencies),
        handleUserBlockController:handleUserBlockController(dependencies)
    }
    
}
    



