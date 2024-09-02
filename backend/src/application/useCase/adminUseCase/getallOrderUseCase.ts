export default (dependencies: any)=> {
    const {  adminRespository } = dependencies.respository;

    const executeFunction = async (requestData: any) => {
        try {
            const response = await adminRespository.getAllOrders(requestData);
           
          
            if (response.status) {
                return { status: true, data: response.data };
            } else {
                return { status: false, message: response.message };
            }
        } catch (error) {
            console.log(error);
            return { status: false, message: "Error in adminOrderUseCase" };
        }
    };

    return { executeFunction };
}
