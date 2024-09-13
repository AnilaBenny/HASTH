import { Response } from 'express';
import jwt from 'jsonwebtoken';

const generateToken = ({ userId,role }: { userId: string,role?:string })=> {
  const roleToUse = role || 'user';
  const accessToken= jwt.sign({ userId,role:roleToUse }, "anila@123", {
    expiresIn: '30m',
  });
  const refreshToken = jwt.sign({ userId,role:roleToUse }, "anila@123", {
    expiresIn: '30d',
  });
  
  return {accessToken,refreshToken};
};
export default generateToken;

export const verifyToken = (token: string) => {
   return jwt.verify(token, "anila@123");
 };



