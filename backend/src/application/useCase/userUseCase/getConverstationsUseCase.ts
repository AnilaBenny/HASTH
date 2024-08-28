import logger from "../../../logger";

export default function getConverstationsUseCase(dependencies: any) {
    const {   userRespository } = dependencies.respository;

    const executeFunction = async (data:any) => {
        try {
            
            const response = await userRespository.getConversation(data);
            
            
            
            if (response.status) {
                return { status: true, data: response.data };
                
            } else {
                return { status: false, message: response.message };
            }
            
        } catch (error) {
            logger.error(error)
            return { status: false, message: "Error in getConverstationsUseCase" };
        }

    };

    return { executeFunction };
}
