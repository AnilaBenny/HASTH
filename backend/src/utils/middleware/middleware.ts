import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../generateToken';
import logger from '../../logger';

export const middleware = async (req: Request, res: Response, next: NextFunction) => {
  const authorizationHeader = (req.headers as { authorization?: string }).authorization;
  console.log(authorizationHeader, 'authorization....////');

  const token = authorizationHeader?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ status: false, message: 'No token provided' });
  }

  try {
    const decoded = await verifyToken(token) as { userId: string, role: string };
    console.log(decoded, 'decoded');
    

    (req as any).user = {
      userId: decoded.userId,
      role: decoded.role
    };
    console.log((req as any).user);
    
  
    if (decoded.role === 'admin') {
 
      console.log('Admin access granted');
    } else if (decoded.role === 'user') {
    
      console.log('User access granted');
    } else {

      return res.status(403).json({ status: false, message: 'Forbidden: Insufficient rights' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ status: false, message: 'Invalid or expired token' });
  }
}
