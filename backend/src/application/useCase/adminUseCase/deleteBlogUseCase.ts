
export default (dependencies: any) => {
    const { adminRespository} = dependencies.respository;
  
    const executeFunction = async (data:any) => {
      try {
        const result = await adminRespository.deleteBlog(data);  
        return result;
      } catch (error) {
        console.error("Error in deleteBlog:", error);
        throw error;
      }
    };
  
    return {
      executeFunction:executeFunction
  };
  
  };
  