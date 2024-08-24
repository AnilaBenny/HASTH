import { Request, Response } from "express";

export default (dependencies: any) => {
    const { deletecartItemUseCase } = dependencies.useCase;
    const deleteCartController = async (req: Request, res: Response) => {
        try {
        
            const executeFunction = await deletecartItemUseCase(dependencies)
            const response=await executeFunction.executeFunction(req.body);
            
            
            if (response && response.status) {
                
                res.json({ status: true, data: response.data });
            } else {
                res.status(400).json({ status: false, message: response.message || "item deletion failed" });
            }
        } catch (error) {
            console.error("Error in deletecartItemController:", error);
            res.status(500).json({ status: false, message: "Internal server error" });
        }
    };

    return deleteCartController;
};
