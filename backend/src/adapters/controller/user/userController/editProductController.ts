import { Request, Response } from 'express';

interface MulterRequest extends Request {
  files: {
    [fieldname: string]: Express.Multer.File[];
  };
}

export default (dependencies: any) => {
  const postEditController = async (req: Request, res: Response) => {
    try {
      const { productEditUseCase } = dependencies.useCase;

      // Log the incoming request body
      console.log('Request body:', req.body);

      // Check if req.body and req.body.data exist
      if (!req.body || !req.body.data) {
        return res.status(400).json({ status: false, message: 'Invalid request data' });
      }

      const existingProduct = req.body.data;


      if (!existingProduct) {
        return res.status(404).json({ status: false, message: 'Product not found' });
      }

      let images: string[] = existingProduct.images || [];

      const multerReq = req as MulterRequest;

      if (multerReq.files && multerReq.files['images']) {
        const uploadedImages = multerReq.files['images'].map(file => file.filename);
        images = [...images, ...uploadedImages];
      }

      const data = {
        productId:existingProduct._id,
        ...req.body,
        images,
      };

      console.log('Data for use case:', data);

      const executeFunction = productEditUseCase(dependencies);

      const response = await executeFunction.executeFunction(data);

      if (response.status) {
        return res.status(200).json({ status: true, data: response.data });
      } else {
        return res.status(400).json({ status: false, message: response.message });
      }
    } catch (error) {
      console.error('Error in product edit controller:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  return postEditController;
};
