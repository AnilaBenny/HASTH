import { Request, Response } from "express";

export default (dependencies: any) => {
    const { pinCommentUseCase } = dependencies.useCase;
    const pinCommentController = async (req: Request, res: Response) => {
        try {
            const data=req.body;
            const executeFunction = await pinCommentUseCase(dependencies)
            const response=await executeFunction.executeFunction(data);
            
            
            if (response && response.status) {
                
                res.json({ status: true, data: response.data });
            } else {
                res.status(400).json({ status: false, message: response.message || "Pin comment failed" });
            }
        } catch (error) {
            console.error("Error in pinComment Controller:", error);
            res.status(500).json({ status: false, message: "Internal server error" });
        }
    };

    return pinCommentController;
};