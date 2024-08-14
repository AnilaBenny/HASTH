export default (dependencies: any)=>{
    const {   userRespository } = dependencies.respository;

    const executeFunction = async (data:any) => {
        try {
            const response = await userRespository.likeOrDislikePost(data);
            console.log(response);
            
            if (response.status) {
                return { status: true, data: response.data };
            } else {
                return { status: false, message: response.message || "like/dislike failed" };
            }
        } catch (error) {
            console.error("Error in likedUseCase:", error);
            return { status: false, message: "Error in likedUseCase" };
        }
    };

    return { executeFunction:executeFunction };
}
