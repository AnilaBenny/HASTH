import logger from "../../../logger";

export default(dependencies: any)=> {
    const {   userRespository } = dependencies.respository;

    const executeFunction = async (data:any) => {
        try {
            const response = await userRespository.reviewEdit(data);
            console.log(response);
            
            if (response.status) {
                return { status: true, data: response.data };
            } else {
                return { status: false, message: response.message || "review edit failed" };
            }
        } catch (error) {
            logger.error("Error in review edit usecase:", error);
            return { status: false, message: "Error in review edit use case" };
        }
    };

    return { executeFunction:executeFunction };
}
