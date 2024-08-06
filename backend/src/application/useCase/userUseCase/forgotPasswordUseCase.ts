
import { sendOtp } from '../../../utils/nodemailer';

export default (dependencies: any)=>{
 
    
    const { userRespository } = dependencies.respository; 

    const executionFunction = async (data: any) => {
        try {
            const { email } = data;
        
        
  
            const userExists = await userRespository.forgotPassword(email);
            
            console.log(userExists,'.....');
            
            if (!userExists.status) {
                return { status: false, data: 'User not find' };
            }

          
            const response = await sendOtp(email);
            if (response.status) {
               
                return { status: true, data: response.otp };
            } else {
                return { status: false, data: response.message };
            }
        } catch (error) {
            console.error('Error in forgot password use case:', error);
            return { status: false, message: 'Internal server error' };
        }
    };

    return {
        executionFunction:executionFunction
    };
}
