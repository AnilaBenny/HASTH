import { Request, Response } from "express";
import logger from "../../../../logger";

export default (dependencies: any) => {
    const { updatestatusUseCase } = dependencies.useCase;
    const updatestatusController = async (req: Request, res: Response) => {
        try {
        
            const executeFunction = await updatestatusUseCase(dependencies)
            const response=await executeFunction.executeFunction(req.body);
            
            
            if (response && response.status) {
                
                res.json({ status: true, data: response.data });
            } else {
                res.status(400).json({ status: false, message: response.message || "status updation failed" });
            }
        } catch (error) {
            logger.error("Error in updateOrderStatusController:", error);
            res.status(500).json({ status: false, message: "Internal server error" });
        }
    };

    return updatestatusController;
};
