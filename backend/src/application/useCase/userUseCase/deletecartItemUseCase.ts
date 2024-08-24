export default(dependencies: any)=> {
    const {   userRespository } = dependencies.respository;

    const executeFunction = async (data: any) => {
        try {
            
            const response = await userRespository.deleteCartItem(data);
            console.log(response);
            
            if (response.status) {
                return { status: true, data: response.data };
            } else {
                return { status: false, message: response.message || "CartItem deletion failed" };
            }
        } catch (error) {
            console.error("Error in deleteCart usecase:", error);
            return { status: false, message: "Error in deleteCartItem use case" };
        }
    };

    return { executeFunction:executeFunction };
}
