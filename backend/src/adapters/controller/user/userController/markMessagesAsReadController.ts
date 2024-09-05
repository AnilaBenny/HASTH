import { Request, Response } from "express";
import logger from "../../../../logger";

export default (dependencies: any) => {
    const { markMessagesAsReadUseCase } = dependencies.useCase;
    const markMessagesAsReadUseCaseController = async (req: Request, res: Response) => {
        try {
            const data=req.body;
            const executeFunction = await markMessagesAsReadUseCase(dependencies)
            const response=await executeFunction.executionFunction(data);
            
            
            if (response && response.status) {
                
                res.json({ status: true, data: response.data });
            } else {
                res.status(400).json({ status: false, message: response.message || "markMessagesAsReadUseCase failed" });
            }
        } catch (error) {
            logger.error("Error in markMessagesAsReadUseCase Controller:", error);
            res.status(500).json({ status: false, message: "Internal server error" });
        }
    };

    return markMessagesAsReadUseCaseController;
};