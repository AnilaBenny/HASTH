
export default (dependencies: any) => {
  const { adminRespository} = dependencies.respository;

  const executeFunction = async (data: { email: string; password: string }) => {
    try {
      const result = await adminRespository.verifyAdmin(data.email, data.password);
      console.log('result',result);
      
      return result;
    } catch (error) {
      console.error("Error in executeFunction:", error);
      throw error;
    }
  };

  return {
    executeFunction:executeFunction
};

};
