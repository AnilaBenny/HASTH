import logger from "../../../logger";

export default (dependencies: any) => {
    const { userRespository } = dependencies.respository;  
  
    const executeFunction = async (data: any) => {
      try {
    
        const response = await userRespository.createCommentReply(data);
        if (response.status) {
          return { status: true, data: response.data };
        } else {
          return { status: false, message: response.message };  
        }
      } catch (error) {
        logger.error('Error in comment reply use case:', error);
        return { status: false, message: 'Internal server error' };
      }
    };
  
    return {
      executeFunction:executeFunction
    };
  };
  