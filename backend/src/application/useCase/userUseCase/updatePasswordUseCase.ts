
import { log } from "console";
import { hashPassword } from "../../../utils";

export default (dependencies: any)=>{
 
    const { userRespository } = dependencies.respository; 

    const executeFunction = async (data: any) => {
        try {
            
            const { email,newPassword } = data;
            const password=await hashPassword(newPassword);
            const response = await userRespository.updatePassword({email,password});
            
        
            if (response.status) {
               
                return { status: true, message:'Password updated' };
            } else {
                return { status: false, data: response.message };
            }
        } catch (error) {
            console.error('Error in forgot password use case:', error);
            return { status: false, message: 'Internal server error' };
        }
    };

    return  {executeFunction:executeFunction};
}
