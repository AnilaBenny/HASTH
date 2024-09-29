import createImage from "../../../utils/createImage";

export default (dependencies: any) => {
    
    const { userRespository } = dependencies.respository; 
    const executionFunction = async (data: any) => {
        try {
            
            data.image=await createImage(data.name)||''
            console.log(data);
            
            const response = await userRespository.createUser(data);
            
            

            if (response.status) {
                return { status: true, data: response.data }; 
            } else {
                return { status: false, data: response.data };
            }
        } catch (error) {
            console.error('Error in otp verification use case:', error);
            return { status: false, message: 'Internal server error' };
        }
    };

    return {
        executionFunction:executionFunction
    };
};
