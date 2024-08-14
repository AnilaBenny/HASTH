import { Request, Response } from "express";

export default (dependencies: any) => {
    const { getPostUseCase } = dependencies.useCase;

    const getPostController = async (req: Request, res: Response) => {
        try {
           

            const executeFunction = await getPostUseCase(dependencies);
            console.log(executeFunction);

            const response=await executeFunction.executeFunction();

            if (response && response.status) {
                return res.status(200).json({ status: true, data: response.data });
            } else {
                return res.status(404).json({ status: false, message: "Data not found" });
            }
        } catch (error) {
            console.error("Error in getPost Controller:", error);
            return res.status(500).json({ status: false, message: "Internal server error" });
        }
    };

    return getPostController;
};
