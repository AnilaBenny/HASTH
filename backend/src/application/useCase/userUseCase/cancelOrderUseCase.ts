import logger from "../../../logger";

export default(dependencies: any)=> {
    const {   userRespository } = dependencies.respository;

    const executeFunction = async (data: any) => {
        try {
            console.log(data);
            
            const response = await userRespository.cancelOrder(data);
      
            if (response.status) {
                return { status: true, data: response.data };
            } else {
                return { status: false, message: response.message || "cancelOrder failed" };
            }
        } catch (error) {
            logger.error("Error in cancelOrder usecase:", error);
            return { status: false, message: "Error in cancelOrder use case" };
        }
    };

    return { executeFunction:executeFunction };
}
