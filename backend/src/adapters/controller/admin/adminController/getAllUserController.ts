import { Request, Response } from "express";

export default (dependencies: any) => {
    const { getallUseCase } = dependencies.useCase;
    const adminUserController = async (req: Request, res: Response) => {
        try {
            
            const response = await getallUseCase(dependencies).executeFunction(req.body);
            
            if (response && response.status && response.data) {
                res.json({ status: true, data: response.data });
            } else {
                res.json({ status: false, message: "Data not found" });
            }
        } catch (error) {
            console.error("Error in getAll user:", error);
            res.status(500).json({ status: false, message: "Internal server error" });
        }
    };

    return adminUserController;
};
