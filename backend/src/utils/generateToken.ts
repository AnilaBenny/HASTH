import { Response } from 'express';
import jwt from 'jsonwebtoken';

interface GenerateTokenOptions {
  userId: any;
}
const generateToken = ({  userId }: GenerateTokenOptions)=> {
  
  const accessToken= jwt.sign({ userId }, "anila@123", {
    expiresIn: '30m',
  });
  const refreshToken = jwt.sign({ userId }, "anila@123", {
    expiresIn: '30d',
  });
  
  return {accessToken,refreshToken};
};
export default generateToken;

export const verifyToken = (token: string) => {
   return jwt.verify(token, "anila@123");
 };

