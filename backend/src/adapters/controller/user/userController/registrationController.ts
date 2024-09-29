import { Request, Response } from 'express';
import { hashPassword } from '../../../../utils';
import logger from '../../../../logger';


export default (dependencies: any) => {
  const { userRegistration } = dependencies.useCase;

  const registerController = async (req: Request, res: Response) => {
    try {
      
      
      const { name, email, password, mobile, skills, education, specification, street, city, state, zipCode, role } = req.body;


      const hashedPassword = await hashPassword(password);

 
      const data = {
        name,
        email,
        password: hashedPassword,
        mobile,
        skills,
        education,
        specification,
        street,
        city,
        state,
        zipCode,
        role,
      };

  
      res.cookie('userData',data , {
        maxAge: 900000, 
        secure: true,
        sameSite:'none'
      });
      console.log(req.cookies.userData,'cookie');
      

      const executionFunction = await userRegistration(dependencies);
      const response = await executionFunction.executionFunction(data);

      console.log(response,'resp in registr');
      if (response.status) {
        res.cookie('otp',response.data , {
          maxAge: 60000, 
          secure: true,
          sameSite:'none'
        });
        
        res.json({ status: true , data: response.data });
      } else  {
        res.json({ status: false, data: response.data });
      }

    } catch (error) {
      logger.error('Error in registration controller:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  return registerController;
};
