import { Request, Response } from "express";

export default function googleRegisterController(dependencies: any) {
  const { googleRegisterUseCase } = dependencies.useCase;

  if (!googleRegisterUseCase) {
    throw new Error("googleRegisterUseCase is not defined in dependencies");
  }

  const googleRegisterController = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        console.log('Authentication failed: req.user is undefined');
        return res.status(401).json({ message: 'Authentication failed' });
      }

      console.log('Authenticated user:', req.user);
      const response = await googleRegisterUseCase(dependencies).executeFunction(req.user);
      console.log('Use case response:', response);

      if (response.status) {
        res.cookie('accessToken', response.data.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 30 * 60 * 1000 
        });

        res.cookie('refreshToken', response.data.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 30 * 24 * 60 * 60 * 1000 
        });
        const encodedToken=encodeURIComponent(response.data)
        return res.redirect(`http://localhost:5173/register?status=true&user=${encodeURIComponent(JSON.stringify(req.user))}&token=${encodedToken}`);
      } else {
        return res.redirect('http://localhost:5173/register?status=false');
      }
    } catch (error) {
      console.error("Error in Google register controller:", error);
      return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
  };

  return googleRegisterController;
}
