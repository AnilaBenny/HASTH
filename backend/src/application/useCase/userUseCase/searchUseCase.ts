import logger from "../../../logger";

export default(dependencies: any)=> {
    const {   userRespository } = dependencies.respository;

    const executeFunction = async (data:any) => {
        try {
            const response = await userRespository.search(data);

                return { status: true, data: response };

        } catch (error) {
            logger.error("Error in search usecase:", error);
            return { status: false, message: "Error in search use case" };
        }
    };

    return { executeFunction:executeFunction };
}
