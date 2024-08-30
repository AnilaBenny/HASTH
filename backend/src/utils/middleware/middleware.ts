import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../generateToken';
import { databaseSchema } from '../../frameworks/database';
import logger from '../../logger';

export const middleware = async (req: Request, res: Response, next: NextFunction) => {
  const authorizationHeader = (req.headers as { authorization?: string }).authorization;
  console.log(authorizationHeader, 'authorization....////');

  const token = authorizationHeader?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ status: false, message: 'No token provided' });
  }

  try {
    const decoded =await verifyToken(token);
    console.log(decoded,'decoded');
    
    (req as any).user = (decoded as { userId: string });
    console.log((req as any).user);
    

  
    const user = await databaseSchema.User.findById((req as any).user.userId);
    if (!user) {
      logger.error('User not found')
      return res.status(401).json({ status: false, message: 'User not found' });
    }

    if (user.isBlocked) {
      logger.error('User is blocked')

      return res.status(401).json({ status: false, message: 'User is blocked' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ status: false, message: 'Invalid or expired token' });
  }
}