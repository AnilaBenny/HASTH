import { Request, Response } from "express";

export default (dependencies: any) => {
    const { paymentStatusUseCase } = dependencies.useCase;
    const paymentStatusController = async (req: Request, res: Response) => {
        try {

            const executeFunction = await paymentStatusUseCase(dependencies)
            const response=await executeFunction.executeFunction(req.body);
            
            
            if (response && response.status) {
                
                res.json({ status: true, data: response.data });
            } else {
                res.status(400).json({ status: false, message: response.message || "paymentStatus failed" });
            }
        } catch (error) {
            console.error("Error in paymentStatus Controller:", error);
            res.status(500).json({ status: false, message: "Internal server error" });
        }
    };

    return paymentStatusController;
};