import { Request, Response } from "express";

export default (dependencies: any) => {
    const { statusProductUseCase } = dependencies.useCase;
    const statusProductController = async (req: Request, res: Response) => {
        try {
            const { productId } = req.params;
            console.log(productId);
            

            
            const executeFunction = await statusProductUseCase(dependencies)
            const response=await executeFunction.executeFunction(productId);
            console.log(response,'....res');
            
            if (response && response.status) {
                
                res.json({ status: true, data: response.data });
            } else {
                res.status(400).json({ status: false, message: response.message || "Product status failed" });
            }
        } catch (error) {
            console.error("Error in Product status Controller:", error);
            res.status(500).json({ status: false, message: "Internal server error" });
        }
    };

    return statusProductController;
};