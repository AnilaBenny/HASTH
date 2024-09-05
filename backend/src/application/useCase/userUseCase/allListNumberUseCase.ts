export default (dependencies: any)=> {
    

    const executeFunction = async (data:any) => {
        try {
           
            const {  userRespository } = dependencies.respository;
            
            const response = await userRespository.allListNumber(data);
           
          
            if (response.status) {
                return { status: true, data: response.data };
            } else {
                return { status: false, message: response.message };
            }
        } catch (error) {
            console.log(error);
            return { status: false, message: "Error in allListnumber usecase" };
        }
    };

    return { executeFunction };
}
