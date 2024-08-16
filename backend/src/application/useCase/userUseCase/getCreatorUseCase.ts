export default (dependencies: any)=> {
    

    const executeFunction = async () => {
        try {
           
            const {  userRespository } = dependencies.respository;
            
            const response = await userRespository.getCreators();
           
            console.log('hiiii',response);
          
            if (response.status) {
                return { status: true, data: response.data };
            } else {
                return { status: false, message: response.message };
            }
        } catch (error) {
            console.log(error);
            return { status: false, message: "Error in creatorUseCase" };
        }
    };

    return { executeFunction };
}
