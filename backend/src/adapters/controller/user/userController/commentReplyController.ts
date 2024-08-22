import { Request, Response } from 'express';
import logger from '../../../../logger';

export default (dependencies: any) => {
  const commentReplyController = async (req: Request, res: Response) => {
    try {
      const { commentReplyUseCase } = dependencies.useCase;
      const { text, userId,postId,commentId} = req.body;

      const data = {
        userId,
        text,
        commentId,
      };

      const executeFunction = commentReplyUseCase(dependencies);

      const response = await executeFunction.executeFunction(data); 
      logger.info('Response:', response);

      if (response.status) {
        return res.status(200).json({ status: true, data: response.data });
      } else {
        return res.status(400).json({ status: false, data: response.data });
      }
    } catch (error) {
      logger.error('Error in comment reply controller:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  return commentReplyController;
};
