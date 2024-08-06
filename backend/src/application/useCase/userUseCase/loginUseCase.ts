import { verifyHashPassword } from "../../../utils";

export default function loginUseCase(dependencies: any) {
  const { userRespository } = dependencies.respository; 

  const executeFunction = async (data: any) => {
    try {
    
      const response = await userRespository.finduser(data.email);
      

      if (response.status) {
        const user = response.user; 

        const isPasswordCorrect = await verifyHashPassword(data.password, user.password);

        if (isPasswordCorrect) {
          return { status: true, data: user };
        } else {
          return { status: false, message: 'Incorrect password' };
        }
      } else {
        return { status: false, message: response.message };
      }
    } catch (error) {
      console.error('Error in login verification use case:', error);
      return { status: false, message: 'Internal server error' };
    }
  };

  return { executeFunction };
}
