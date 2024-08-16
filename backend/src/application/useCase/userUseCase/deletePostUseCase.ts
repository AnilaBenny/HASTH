export default(dependencies: any)=> {
    const {   userRespository } = dependencies.respository;

    const executeFunction = async (userId: any) => {
        try {
            const response = await userRespository.deletePost(userId);
            console.log(response);
            
            if (response.status) {
                return { status: true, data: response.data };
            } else {
                return { status: false, message: response.message || "Post deletion failed" };
            }
        } catch (error) {
            console.error("Error in deletePost usecase:", error);
            return { status: false, message: "Error in deletePost use case" };
        }
    };

    return { executeFunction:executeFunction };
}
