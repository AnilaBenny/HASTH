
import logger from "../../../logger";

export default function sendImageUseCase(dependencies: any) {
    const { userRespository } = dependencies.respository;

    const executeFunction = async (data: any) => { 
        try {
            const response = await userRespository.sendImage(data);
           
            console.log(response,'....il');
            
            
            if (response.status) {
                return { status: true, data: response.data };
            } else {
                return { status: false, message: response.data };
            }
        } catch (error) {
           logger.error(error);
            return { status: false, message: "Error in sendImageUseCase" };
        }
    };

    return { executeFunction };
}
