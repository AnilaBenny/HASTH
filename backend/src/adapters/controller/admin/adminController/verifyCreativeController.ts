import { Request, Response } from "express";

export default (dependencies: any) => {
    const { verifyCreativeUseCase } = dependencies.useCase;
    const verifyCreative = async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;

            
            const executeFunction = await verifyCreativeUseCase(dependencies)
            const response=await executeFunction.executeFunction(userId);
            console.log(response,'.....');
            
            if (response && response.status) {
                res.json({ status: true, data: response.data });
            } else {
                res.status(400).json({ status: false, message: response.message || "creative verification failed" });
            }
        } catch (error) {
            console.error("Error in verifyCreativeController:", error);
            res.status(500).json({ status: false, message: "Internal server error" });
        }
    };

    return verifyCreative;
};
