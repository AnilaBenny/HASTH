import { Request, Response } from "express";
import logger from "../../../../logger";

export default (dependencies: any) => {
    const { cancelOrderUseCase } = dependencies.useCase;
    const cancelOrderController = async (req: Request, res: Response) => {
        try {
        
            const executeFunction = await cancelOrderUseCase(dependencies)
            const response=await executeFunction.executeFunction(req.body);
            
            
            if (response && response.status) {
                
                res.json({ status: true, data: response.data });
            } else {
                res.status(400).json({ status: false, message: response.message || "order cancellation failed" });
            }
        } catch (error) {
            logger.error("Error in cancelOrderController:", error);
            res.status(500).json({ status: false, message: "Internal server error" });
        }
    };

    return cancelOrderController;
};
