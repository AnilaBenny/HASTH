export default (dependencies: any)=>{
    const {   adminRespository } = dependencies.respository;

    const executeFunction = async (userId: any) => {
        try {
            const response = await adminRespository.verifyCreative(userId);
            if (response.status) {
                return { status: true, data: response.data };
            } else {
                return { status: false, message: response.message || "Creative Verification failed" };
            }
        } catch (error) {
            console.error("Error in verifyCreativeUseCase:", error);
            return { status: false, message: "Error in verifyCreativeUseCase" };
        }
    };

    return { executeFunction:executeFunction };
}
