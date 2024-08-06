import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../generateToken';

export const middleware = (req: Request, res: Response, next: NextFunction) => {

  const authorizationHeader = (req.headers as { authorization?: string }).authorization;

  const token = authorizationHeader?.split(' ')[1];


  if (!token) {
    return res.status(401).json({ status: false, message: 'No token provided' });
  }

  try {
 
    const decoded = verifyToken(token);
   
    (req as any).user = (decoded as { userId: string }); 

    
    next();
  } catch (error) {

    return res.status(401).json({ status: false, message: 'Invalid or expired token' });
  }
}
