import { Request, Response } from 'express';
import logger from '../../../../logger';


export default (dependencies: any) => {
  const addtoCart = async (req: Request, res: Response) => {
    try {
      const { addtocartUseCase } = dependencies.useCase;

     
      const executeFunction = await addtocartUseCase(dependencies);
      console.log(executeFunction);

      const response = await executeFunction.executeFunction(req.body);
console.log(response);

      if (response.status) {
        return res.status(200).json({ status: true, data: response.data });
      } else {
        return res.status(200).json({ status: false, message: response.message });
      }
    } catch (error) {
      logger.error('Error in add to cart controller:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  return addtoCart;
};
