import { Request, Response } from 'express';

export default (dependencies:any) => {
    const { refreshTokenUsecase } =  dependencies.useCase;
  
  return async(req:Request,res:Response)=>{
    try {
        const refreshToken = req.cookies['refreshToken'];
    
        if (!refreshToken) {
          return res.status(401).json({ status: false, message: 'No refresh token provided' });
        }
    
        const response = await refreshTokenUsecase.executeFunction(refreshToken);
    
        if (!response.status) {
          return res.status(403).json({ status: false, message: response.message });
        }
    
        res.cookie('refreshToken', response.data.refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        return res.json({ accessToken: response.data.accessToken });
    
      } catch (error) {
        console.error('Error in refreshTokenController:', error);
        return res.status(500).json({ status: false, message: 'Internal Server Error' });
      }
  }  
};

