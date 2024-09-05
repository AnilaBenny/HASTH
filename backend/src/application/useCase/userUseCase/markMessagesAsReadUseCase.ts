import logger from "../../../logger";

export default (dependencies: any)=> {
    

    const executionFunction = async (data:any) => {
        try {
           
            const {  userRespository } = dependencies.respository;
            
            const response = await userRespository.markMessagesAsRead(data);
           
          
            if (response.status) {
                return { status: true, data: response.data };
            } else {
                return { status: false };
            }
        } catch (error) {
            logger.error(error);
            return { status: false, message: "Error in markMessagesAsRead usecase" };
        }
    };

    return { executionFunction };
}
