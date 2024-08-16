export default (dependencies: any)=> {
    const {  userRespository } = dependencies.respository;

    const executeFunction = async (requestData: any) => {
        try {
            const response = await userRespository.getProducts(requestData);
           
          
            if (response.status) {
                return { status: true, data: response.data };
            } else {
                return { status: false, message: response.message };
            }
        } catch (error) {
            console.log(error);
            return { status: false, message: "Error in productUseCase" };
        }
    };

    return { executeFunction };
}
