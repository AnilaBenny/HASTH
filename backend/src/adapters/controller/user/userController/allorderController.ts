import { Request, Response } from 'express';
import logger from '../../../../logger';


export default (dependencies: any) => {
  const {allorderUseCase } = dependencies.useCase;

  const allorderController = async (req: Request, res: Response) => {
    try {


      const executionFunction = await allorderUseCase(dependencies);
      const response = await executionFunction.executionFunction(req.params.userId);

  if (response.status) {
   
        res.json({ status: true , data: response.data });
      } else  {
        res.json({ status: false });
      }

    } catch (error) {
      logger.error('Error in allorderbyuser controller:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  return allorderController;
};
