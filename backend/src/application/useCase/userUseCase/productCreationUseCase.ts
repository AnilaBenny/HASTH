export default (dependencies: any) => {
    const { userRespository } = dependencies.respository;  
  
    const executeFunction = async (data: any) => {
      try {
    
        const response = await userRespository.createProduct(data);
      
        if (response.status) {
          return { status: true, data: response.data };
        } else {
          return { status: false, message: response.message };  
        }
      } catch (error) {
        console.error('Error in product creation use case:', error);
        return { status: false, message: 'Internal server error' };
      }
    };
  
    return {
      executeFunction:executeFunction
    };
  };
  