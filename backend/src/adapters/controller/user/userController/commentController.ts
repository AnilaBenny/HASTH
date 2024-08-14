import { Request, Response } from 'express';

export default (dependencies: any) => {
  const commentCreationController = async (req: Request, res: Response) => {
    try {
      const { commentCreationUseCase } = dependencies.useCase;
      const { userId, postId, text} = req.body;
   
      const data = {
        userId,
         postId, 
         text
      };

      const executeFunction = await commentCreationUseCase(dependencies);
      console.log(executeFunction);
     
      const response = await executeFunction.executeFunction(data);
      console.log('response',response);
      if (response.status) {
        return res.status(200).json({ status: true, data: response.data });
      } else {
        return res.status(400).json({ status: false, data: response.data });
      }
    } catch (error) {
      console.error('Error in comment creation controller:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  return commentCreationController;
};