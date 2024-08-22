import { Request, Response } from 'express';
import logger from '../../../../logger';


export default (dependencies: any) => {
    const { otpVerification } = dependencies.useCase;

    const verifyOtp = async (req: Request, res: Response) => {
       
        
        const { otp } = req.body;
        const userData = req.session.userData;
      
        
        
        logger.info('Entered OTP:', otp,req.session.otp);
        
        
        if (req.session.otp === otp) {
            try {
                const executionFunction = await otpVerification(dependencies);
                const response=await executionFunction.executionFunction(userData);
                if (response.status) {
                    logger.info(response.data)
                    const { password, ...sanitizedData } = response.data.toObject
            ? response.data.toObject()
            : response.data;
                    res.json({ status: true, data: response.sanitizedData });
                } else {
                    res.json({ status: false, message: 'Verification failed' });
                }
            } catch (error) {
                logger.error('Error in OTP verification:', error);
                res.status(500).json({ status: false, message: 'Internal server error' });
            }
        } else {
            logger.warn('wrong otp')
            res.status(400).json({ status: false, message: 'Wrong OTP' });
        }
    };

    return verifyOtp;
};
