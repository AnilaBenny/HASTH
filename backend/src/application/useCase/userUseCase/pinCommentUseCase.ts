export default(dependencies: any)=> {
    const {   userRespository } = dependencies.respository;

    const executeFunction = async (data: any) => {
        try {
            
            
            const response = await userRespository.pinunpinComment(data);
            console.log(response);
            
            if (response.status) {
                return { status: true, data: response.data };
            } else {
                return { status: false, message: response.message || "pin or unpin failed " };
            }
        } catch (error) {
            console.error("Error in pin unpin Comment usecase:", error);
            return { status: false, message: "Error in  pinunpinComment use case" };
        }
    };

    return { executeFunction:executeFunction };
}
