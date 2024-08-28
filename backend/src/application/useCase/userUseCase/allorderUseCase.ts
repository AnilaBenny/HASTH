export default (dependencies: any)=> {
    

    const executionFunction = async (userId:any) => {
        try {
           
            const {  userRespository } = dependencies.respository;
            
            const response = await userRespository.allorderbyuser(userId);
           
          
            if (response.status) {
                return { status: true, data: response.data };
            } else {
                return { status: false };
            }
        } catch (error) {
            console.log(error);
            return { status: false, message: "Error in order usecase" };
        }
    };

    return { executionFunction };
}
