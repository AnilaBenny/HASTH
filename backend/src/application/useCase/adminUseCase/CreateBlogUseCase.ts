
export default (dependencies: any) => {
    const { adminRespository} = dependencies.respository;
  
    const executeFunction = async (data:any) => {
      try {
        const result = await adminRespository.createBlog(data);  
        return ({ status: true, data: result})
      } catch (error) {
        console.error("Error in executeFunction:", error);
        throw error;
      }
    };
  
    return {
      executeFunction:executeFunction
  };
  
  };
  