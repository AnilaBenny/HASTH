import { Request, Response } from "express";

export default (dependencies: any) => {
    const { searchUseCase } = dependencies.useCase;
    const searchController = async (req: Request, res: Response) => {
        try {
      
            const executeFunction = await searchUseCase(dependencies)
            const response=await executeFunction.executeFunction(req.query.q);
            
            if (response && response.status) {
                
                res.json({ status: true, data: response.data });
            } else {
                res.status(400).json({ status: false, message: response.message || "search failed" });
            }
        } catch (error) {
            console.error("Error in searchController:", error);
            res.status(500).json({ status: false, message: "Internal server error" });
        }
    };

    return searchController;
};
