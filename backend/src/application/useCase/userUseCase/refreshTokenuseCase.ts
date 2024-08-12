import generateToken, { verifyToken } from "../../../utils/generateToken";
import { JwtPayload } from 'jsonwebtoken';

export default (dependencies: any) => {
  const { userRepository } = dependencies.repository;

  const executeFunction = async (data: any) => {
    try {
      const { refreshToken } = data;

      const decoded = verifyToken(refreshToken) as JwtPayload;

      const userId = decoded.userId;

      if (!userId) {
        return { status: false, message: 'Invalid token payload' };
      }


      const User = await userRepository.getUserByEmail(userId.email);

      if (!User) {
        return { status: false, message: 'User not found' };
      }

      if (User.isBlocked) {
        return { status: false, message: 'User is blocked' };
      }

      const { accessToken, refreshToken: newRefreshToken } = generateToken({ userId });

      return { status: true, data: { accessToken, refreshToken: newRefreshToken } };

    } catch (error) {
      console.error('Error in executeFunction:', error);
      return { status: false, message: 'Internal Server Error' };
    }
  };

  return { executeFunction };
};
