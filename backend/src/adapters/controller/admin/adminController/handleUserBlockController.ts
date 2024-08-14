import { Request, Response } from "express";

export default (dependencies: any) => {
    const { handleUserBlockUseCase } = dependencies.useCase;
    const handleUserBlockController = async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;

            
            const executeFunction = await handleUserBlockUseCase(dependencies)
            const response=await executeFunction.executeFunction(userId);
            console.log(response,'....res');
            
            if (response && response.status) {
                res.clearCookie('accessToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
                res.clearCookie('refreshToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
                res.json({ status: true, data: response.data });
            } else {
                res.status(400).json({ status: false, message: response.message || "User blocking/unblocking failed" });
            }
        } catch (error) {
            console.error("Error in handleUserBlockController:", error);
            res.status(500).json({ status: false, message: "Internal server error" });
        }
    };

    return handleUserBlockController;
};
