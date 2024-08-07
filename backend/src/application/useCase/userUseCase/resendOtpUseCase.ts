import { sendOtp } from '../../../utils/nodemailer';

export default (dependencies: any)=>{
 
    
    const executionFunction = async (email: any) => {
        try {
           
            const response = await sendOtp(email);
           
            if (response.status) {
               
                return { status: true, data: response.otp };
            } else {
                return { status: false, data: response.message };
            }
        } catch (error) {
            console.error('Error in resend Otp use case:', error);
            return { status: false, message: 'Internal server error' };
        }
    };

    return {
        executionFunction:executionFunction
    };
}
