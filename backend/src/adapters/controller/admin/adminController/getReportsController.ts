import { Request, Response } from "express";

export default (dependencies: any) => {
    const { getallReportUseCase } = dependencies.useCase;

    const adminReportController = async (req: Request, res: Response) => {
        try {
            const page = parseInt(req.query.page as string, 10) || 1;
            const limit = parseInt(req.query.limit as string, 10) || 8;

            const response = await getallReportUseCase(dependencies).executeFunction({ page, limit });
            console.log(response);
            
            if (response && response.status) {
                return res.status(200).json({ status: true, data: response.data });
            } else {
                return res.status(404).json({ status: false, message: "Data not found" });
            }
        } catch (error) {
            console.error("Error in getAll Report:", error);
            return res.status(500).json({ status: false, message: "Internal server error" });
        }
    };

    return adminReportController;
};
