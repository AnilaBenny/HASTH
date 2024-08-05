import { sendOtp } from '../../../utils/nodemailer';

export default function userRegistration(dependencies: any) {
 
    
    const { userRespository } = dependencies.respository; 

    const executionFunction = async (data: any) => {
        try {
            const { email } = data;
           
            

            
            const userExists = await userRespository.getUserByEmail({ email });
            // console.log(userExists);
            
            if (userExists.status) {
                return { status: false, data: 'User already exists' };
            }

          
            const response = await sendOtp(email);
            if (response.status) {
               
                return { status: true, data: response.otp };
            } else {
                return { status: false, data: response.message };
            }
        } catch (error) {
            console.error('Error in user registration use case:', error);
            return { status: false, message: 'Internal server error' };
        }
    };

    return {
        executionFunction:executionFunction
    };
}
