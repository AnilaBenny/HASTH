import { Response } from 'express';
import jwt from 'jsonwebtoken';

interface GenerateTokenOptions {
  userId: any;
}
const generateToken = ({  userId }: GenerateTokenOptions): { token: string }=> {
  
  const token = jwt.sign({ userId }, "anila@123", {
    expiresIn: '30d',
  });
  return {token};
};
export default generateToken;

export const verifyToken = (token: string) => {
   return jwt.verify(token, "anila@123");
 };


