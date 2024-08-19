import { Request, Response } from 'express';

interface MulterRequest extends Request {
  files: {
    [fieldname: string]: Express.Multer.File[];
  };
}

export default (dependencies: any) => {
  const postEditController = async (req: Request, res: Response) => {
    try {
      console.log(req.body._id);

      const { postEditUseCase } = dependencies.useCase;
      const { _id, caption, tags, existingImages,existingVideo } = req.body;

      const postId=_id;
      let images: string[] = existingImages 
      let video: string = existingVideo;

      const multerReq = req as MulterRequest;

      if (multerReq.files) {
        if (multerReq.files['images']) {
          const newImages = multerReq.files['images'].map(file => file.filename);
          images = [...images, ...newImages]; 
        }

        if (multerReq.files['video'] && multerReq.files['video'].length > 0) {
          video = multerReq.files['video'][0].filename;
        }
      }

      const data = {
        postId,
        caption,
        images,
        video,
        tags,
      };

      const executeFunction = await postEditUseCase(dependencies);
      const response = await executeFunction.executeFunction(data);

      if (response.status) {
        return res.status(200).json({ status: true, data: response.data });
      } else {
        return res.status(400).json({ status: false, message: response.message });
      }
    } catch (error) {
      console.error('Error in post edit controller:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  return postEditController;
};
