import { Request, Response } from 'express';
import { hashPassword } from '../../../../utils';
import 'express-session';

declare module 'express-session' {
  interface SessionData {
    userData?: {
      name: string;
      email: string;
      password: string;
      mobile: string;
      skills: string;
      education: string;
      specification: string;
      street: string;
      city: string;
      state: string;
      zipcode: string;
      role: string;
    };
    otp?: string; 
  }
}

export default (dependencies: any) => {
  const { userRegistration } = dependencies.useCase;

  const registerController = async (req: Request, res: Response) => {
    try {
      console.log(req.body);
      
      const { name, email, password, mobile, skills, education, specification, street, city, state, zipcode, role } = req.body;


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
        zipcode,
        role,
      };

   
      req.session.userData = data;
      console.log(req.session.userData);
      

      const executionFunction = await userRegistration(dependencies);
      const response = await executionFunction.executionFunction(data);

      // console.log(response);
      if (response.status) {
        req.session.otp = response.data;
        console.log(response);
        
        res.json({ status: true , data: response.data });
      } else  {
        res.json({ status: false, data: response.data });
      }

    } catch (error) {
      console.error('Error in registration controller:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  return registerController;
};
