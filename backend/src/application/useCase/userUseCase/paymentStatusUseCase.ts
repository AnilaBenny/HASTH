export default(dependencies: any)=> {
    const {   userRespository } = dependencies.respository;

    const executeFunction = async (data: any) => {
        try {
            
            const response = await userRespository.paymentStatus(data);
            console.log(response);
            
            if (response.status) {
                return { status: true, data: response.data };
            } else {
                return { status: false, message: response.message || "paymentStatus failed " };
            }
        } catch (error) {
            console.error("Error in paymentStatus usecase:", error);
            return { status: false, message: "Error in  paymentStatus use case" };
        }
    };

    return { executeFunction:executeFunction };
}
