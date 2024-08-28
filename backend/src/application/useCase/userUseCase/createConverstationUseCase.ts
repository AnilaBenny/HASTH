
export default function createConverstationUseCase(dependencies: any) {
    const { userRespository } = dependencies.respository;
  
    const executeFunction = async (data: any) => {
      try {
        const response = await userRespository.createConversation(data);

        
                                              
        if (response.status) {
          return { status: true, data: response.data };
        } else {
          return { status: false, data: response.message };
        }
      } catch (error) {
        console.error('Error in createConverstationUseCase:', error);
        return { status: false, message: 'Internal Server Error' };
      }
    };
  
    return { executeFunction };
  }
  