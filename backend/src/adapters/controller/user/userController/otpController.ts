import { Request, Response } from 'express';


export default (dependencies: any) => {
    const { otpVerification } = dependencies.useCase;

    const verifyOtp = async (req: Request, res: Response) => {
       
        
        const { otp } = req.body;
        const userData = req.session.userData;
      
        
        
        console.log('Entered OTP:', otp,req.session.otp);
        
        
        if (req.session.otp === otp) {
            try {
                const executionFunction = await otpVerification(dependencies);
                console.log(executionFunction);
                const response=await executionFunction.executionFunction(userData);
                if (response.status) {
                    res.json({ status: true, data: response.data });
                } else {
                    res.json({ status: false, message: 'Verification failed' });
                }
            } catch (error) {
                console.error('Error in OTP verification:', error);
                res.status(500).json({ status: false, message: 'Internal server error' });
            }
        } else {
            res.status(400).json({ status: false, message: 'Wrong OTP' });
        }
    };

    return verifyOtp;
};
