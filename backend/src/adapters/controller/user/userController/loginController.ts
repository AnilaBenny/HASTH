import { Request, Response } from "express";
export default (dependecies: any) => {
  
  const {loginVerification}=dependecies.useCase
  const loginController = async (req: Request, res: Response) => {
    const {email,password}=req.body
    const data={
      email,
      password,
    }
  const responce =await loginVerification(dependecies).executeFunction(data) 
  if(responce.status){
    res.cookie('accessToken', responce.token.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 60 * 1000 
    });

    res.cookie('refreshToken', responce.token.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000 
    });
    res.json({status:true,data:responce.data})
  }else{
    res.json({status:false,message:responce.message})
  }
    
  };
  return loginController;
};

