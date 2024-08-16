import { Request, Response } from 'express';


export default (dependencies: any) => {
  const reportController = async (req: Request, res: Response) => {
    try {
      const { reportUseCase } = dependencies.useCase;
      const data= req.body;
      const executeFunction = await reportUseCase(dependencies);
      
     
      const response = await executeFunction.executeFunction(data);
      if (response.status) {
        return res.status(200).json({ status: true, data: response.data });
      } else {
        return res.status(400).json({ status: false, data: response.data });
      }
    } catch (error) {
      console.error('Error in reportController:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  return reportController;
};