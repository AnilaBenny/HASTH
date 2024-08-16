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
      


      const existingPost = req.body.product;

      if (!existingPost) {
        return res.status(404).json({ status: false, message: 'Post not found' });
      }

      let images: string[] = existingPost.images;
     

      const multerReq = req as MulterRequest;

      if (multerReq.files) {
        if (multerReq.files['images']) {
          images = multerReq.files['images'].map(file => file.filename);
        }

      }

      const data = req.body;

      const executeFunction = await productEditUseCase(dependencies);
      console.log(executeFunction);

      const response = await executeFunction.executeFunction(data);
      if (response.status) {
        return res.status(200).json({ status: true, data: response.data });
      } else {
        return res.status(400).json({ status: false, data: response.data });
      }
    } catch (error) {
      console.error('Error in product edit controller:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  return postEditController;
};
