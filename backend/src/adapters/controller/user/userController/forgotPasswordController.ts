import { Request, Response } from 'express';
export default (dependencies: any) => {
  const { forgotPasswordUseCase } = dependencies.useCase;

  const forgotPassword = async (req: Request, res: Response) => {
    try {
      console.log(req.body);
      
      const {email} = req.body;

      const data = {
        email
      };

      const executionFunction = await forgotPasswordUseCase(dependencies);
      const response = await executionFunction.executionFunction(data);
      console.log(response,'........');
      
      if (response.status) {
        
        res.cookie('otp',response.data , {
          maxAge: 60000, 
          secure: true,
        });
        console.log(response);
        
        res.json({ status: true , data: response.data });
      } else  {
        res.json({ status: false, data: response.data });
      }

    } catch (error) {
      console.error('Error in forgot password controller:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  return forgotPassword;
};
