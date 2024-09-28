import { Request, Response } from 'express';


export default (dependencies: any) => {
   

    const verifyOtp = async (req: Request, res: Response) => {
       try{
        
        const { otp } = req.body;

      
        
        
        console.log('Entered OTP:', otp,req.session.otp);
        
        
        if (req.session.otp === otp) {
          
            
                    res.json({ status: true, message:'Otp verified' });
                } else {
                    res.json({ status: false, message: 'Verification failed' });
                }
            } catch (error) {
                console.error('Error in OTP verification:', error);
                res.status(500).json({ status: false, message: 'Internal server error' });
            }
        
    };

    return verifyOtp;
};
