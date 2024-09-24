import logger from "../../../logger";

export default(dependencies: any)=> {
    const {   userRespository } = dependencies.respository;

    const executeFunction = async (data:any) => {
        try {
            const response = await userRespository.search(data);
            console.log(response);
            
            if (response.status) {
                return { status: true, data: response.data };
            } else {
                return { status: false, message: response.message || "search failed" };
            }
        } catch (error) {
            logger.error("Error in search usecase:", error);
            return { status: false, message: "Error in search use case" };
        }
    };

    return { executeFunction:executeFunction };
}
