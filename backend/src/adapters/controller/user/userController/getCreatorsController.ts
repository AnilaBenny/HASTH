import { Request, Response } from "express";
import logger from "../../../../logger";


export default (dependencies: any) => {
    

    const creatorFindController = async (req: Request, res: Response) => {
        try {
            
            const { getCreatorUseCase } = dependencies.useCase;
            
        
            const response = await getCreatorUseCase(dependencies).executeFunction();
            console.log(response, '.....njb');
           
            if (response && response.status) {
                const sanitizedData = Array.isArray(response.data)
                ? response.data.map(({ password, ...rest }:any) => rest) 
                : response.data;
                console.log(sanitizedData);
                

            return res.status(200).json({ status: true, data: sanitizedData });
              
            } else {
                
                return res.status(404).json({ status: false, message: "Data not found" });
            }
        } catch (error) {
            
            logger.error("Error in getAll creator:", error);
            return res.status(500).json({ status: false, message: "Internal server error" });
        }
    };

    return creatorFindController;
};
