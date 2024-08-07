
export default (dependencies: any) => {
    
    const { userRespository } = dependencies.respository; 
    const executionFunction = async (data: any) => {
        try {
            console.log(data);
        
            const response = await userRespository.updateProfile(data);
 
            if (response.status) {
                return { status: true, data: response.data }; 
            } else {
                return { status: false, data: response.data };
            }
        } catch (error) {
            console.error('Error in profile updation use case:', error);
            return { status: false, message: 'Internal server error' };
        }
    };

    return {
        executionFunction:executionFunction
    };
};
