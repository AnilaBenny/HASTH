import { Request, Response } from "express";

export default (dependencies: any) => {
    const { reviewUseCase } = dependencies.useCase;
    const reviewController = async (req: Request, res: Response) => {
        try {
      
            const executeFunction = await reviewUseCase(dependencies)
            const response=await executeFunction.executeFunction(req.body);
            
            if (response && response.status) {
                
                res.json({ status: true, data: response.data });
            } else {
                res.status(400).json({ status: false, message: response.message || "review failed" });
            }
        } catch (error) {
            console.error("Error in reviewController:", error);
            res.status(500).json({ status: false, message: "Internal server error" });
        }
    };

    return reviewController;
};
