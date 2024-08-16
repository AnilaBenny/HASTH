import { Request, Response } from "express";

export default (dependencies: any) => {
    

    const creatorFindController = async (req: Request, res: Response) => {
        try {
            
            const { getCreatorUseCase } = dependencies.useCase;
            
        
            const response = await getCreatorUseCase(dependencies).executeFunction();
            console.log(response, '.....njb');
           
            if (response && response.status) {
                
                return res.status(200).json({ status: true, data: response.data });
            } else {
                
                return res.status(404).json({ status: false, message: "Data not found" });
            }
        } catch (error) {
            
            console.error("Error in getAll creator:", error);
            
            return res.status(500).json({ status: false, message: "Internal server error" });
        }
    };

    return creatorFindController;
};
