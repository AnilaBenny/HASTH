import { Request, Response } from 'express';


interface MulterRequest extends Request {
  files: {
    [fieldname: string]: Express.Multer.File[];
  };
}

export default (dependencies: any) => {
  const postCreationController = async (req: Request, res: Response) => {
    try {
      const { postCreationUseCase } = dependencies.useCase;
      const { userId, caption, tag } = req.body;
      let images: string[] = [];
      let video: string = '';

      const multerReq = req as MulterRequest;

      if (multerReq.files) {
       
        
        if (multerReq.files['images']) {
          images = multerReq.files['images'].map(file => file.filename);
        }
        
        if (multerReq.files['video'] && multerReq.files['video'].length > 0) {
          video = multerReq.files['video'][0].filename;
        }
      }

      const data = {
        userId,
        caption,
        images,
        video,
        tag
      };

      const executeFunction = await postCreationUseCase(dependencies);
      console.log(executeFunction);
     
      const response = await executeFunction.executeFunction(data);
      if (response.status) {
        return res.status(200).json({ status: true, data: response.data });
      } else {
        return res.status(400).json({ status: false, data: response.data });
      }
    } catch (error) {
      console.error('Error in post creation controller:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  return postCreationController;
};