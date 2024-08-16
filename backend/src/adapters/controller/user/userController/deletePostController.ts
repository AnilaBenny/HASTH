import { Request, Response } from "express";

export default (dependencies: any) => {
    const { deletePostUseCase } = dependencies.useCase;
    const deletePostController = async (req: Request, res: Response) => {
        try {
            const { postId } = req.params;

            
            const executeFunction = await deletePostUseCase(dependencies)
            const response=await executeFunction.executeFunction(postId);
            console.log(response,'....res');
            
            if (response && response.status) {
                
                res.json({ status: true, data: response.data });
            } else {
                res.status(400).json({ status: false, message: response.message || "Post delete failed" });
            }
        } catch (error) {
            console.error("Error in deletePostController:", error);
            res.status(500).json({ status: false, message: "Internal server error" });
        }
    };

    return deletePostController;
};
