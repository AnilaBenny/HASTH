import { Request, Response } from "express";

export default (dependencies: any) => {
    const { likedUseCase } = dependencies.useCase;
    const likedController = async (req: Request, res: Response) => {
        try {
            const { userId,postId } = req.body;
            const data={userId,postId}
           
            
            
            const executeFunction = await likedUseCase(dependencies)
            const response=await executeFunction.executeFunction(data);
         
            console.log(response);
            if (response && response.status) {
                return res.json({ status: true, data: response.message });
            } else {
                res.status(400).json({ status: false, message: response.message || "like/dislike failed" });
            }
        } catch (error) {
            console.error("Error in likedController:", error);
            res.status(500).json({ status: false, message: "Internal server error" });
        }
    };

    return likedController;
};
