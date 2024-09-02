import logger from "../../../logger";

export default(dependencies: any)=> {
    const {   userRespository } = dependencies.respository;

    const executeFunction = async (data: any) => {
        try {
            
            const response = await userRespository.updateOrderStatus(data);
            
            
            if (response.status) {
                return { status: true, data: response.data };
            } else {
                return { status: false, message: response.message || "updteStatus failed" };
            }
        } catch (error) {
            logger.error("Error in update status usecase:", error);
            return { status: false, message: "Error in update status use case" };
        }
    };

    return { executeFunction:executeFunction };
}
