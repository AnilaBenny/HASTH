
export default (dependencies: any) => {
    const { userRespository } = dependencies.respository;  
  
    const executeFunction = async (data: any) => {
      try {
    
        const response = await userRespository.createComment(data);
        
        
      
        if (response.status) {
          return { status: true, data: response.data };
        } else {
          return { status: false, message: response.message };  
        }
      } catch (error) {
        console.error('Error in comment creation use case:', error);
        return { status: false, message: 'Internal server error' };
      }
    };
  
    return {
      executeFunction:executeFunction
    };
  };
  