import generateToken from "../../../utils/generateToken";


export default function googleRegisterUseCase() {

  const executeFunction = async (data: any) => {
    try {
      const token = await generateToken(data);

      if (token) {
        return { status: true, data: token };
      } else {
        return { status: false, message: "User registration failed" };
      }
    } catch (error) {
      console.error('Error in Google register use case:', error);
      return { status: false, message: 'Internal Server Error' };
    }
  };

  return { executeFunction };
}
