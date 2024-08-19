export default(dependencies: any)=> {
    const {   userRespository } = dependencies.respository;

    const executeFunction = async (productId: any) => {
        try {
            
            
            const response = await userRespository.activeordeactiveProduct(productId);
            console.log(response);
            
            if (response.status) {
                return { status: true, data: response.data };
            } else {
                return { status: false, message: response.message || "status updation failed in product" };
            }
        } catch (error) {
            console.error("Error in product status updation usecase:", error);
            return { status: false, message: "Error in product status use case" };
        }
    };

    return { executeFunction:executeFunction };
}
