import { Request, Response } from 'express';
import logger from '../../../../logger';
interface MulterRequest extends Request {
  files: {
    [fieldname: string]: Express.Multer.File[]; 
  };
}

export default (dependencies: any) => {
  const addProduct = async (req: Request, res: Response) => {
    try {
      const { productCreationUseCase } = dependencies.useCase;

      let images: string[] = [];

   
      const multerReq = req as MulterRequest;

      if (multerReq.files) {
     
        if (multerReq.files['images']) {
          images = multerReq.files['images'].map(file => file.filename);
        }
      }

      const data = {
        ...req.body,
        images 
      };

     
      const executeFunction = await productCreationUseCase(dependencies);
      console.log(executeFunction);

      const response = await executeFunction.executeFunction(data);

      if (response.status) {
        return res.status(200).json({ status: true, data: response.data });
      } else {
        return res.status(400).json({ status: false, data: response.data });
      }
    } catch (error) {
      logger.error('Error in product creation controller:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  return addProduct;
};
