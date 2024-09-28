import { Request, Response } from 'express';

export default (dependencies: any) => {
  const { resendOtpUseCase } = dependencies.useCase;

  const resendController = async (req: Request, res: Response) => {
    try {
       
        const {email}=req.body;
        
        
      const executionFunction = await resendOtpUseCase(dependencies);
      const response = await executionFunction.executionFunction(email);
      if (response.status) {
        req.cookies('otp',response.data);
        console.log(response);
        
        res.json({ status: true , data: response.data });
      } else  {
        res.json({ status: false, data: response.data });
      }

    } catch (error) {
      console.error('Error in resend otp controller:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  return resendController;
};
