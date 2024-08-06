import { Request, Response } from 'express';

export default (dependencies: any) => {
  const { updatePasswordUseCase } = dependencies.useCase;

  const updatePassword = async (req: Request, res: Response) => {
    try {
      const { email, newPassword } = req.body;
      const useCase = await updatePasswordUseCase(dependencies);
      console.log(useCase);
      
      const response = await useCase.executeFunction({ email, newPassword });

      if (response.status) {
        res.json({ status: true, message: response.message });
      } else {
        res.json({ status: false, message: 'Update failed' });
      }
    } catch (error) {
      console.error('Error in update password:', error);
      res.status(500).json({ status: false, message: 'Internal server error' });
    }
  };

  return updatePassword;
};
