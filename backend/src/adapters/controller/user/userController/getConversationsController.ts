import { Request, Response } from "express";
import logger from "../../../../logger";
export default (dependecies: any) => {
  

  const { getConverstationsUseCase}=dependecies.useCase
  const getConverstationsController = async (req: Request, res: Response) => {
   
    try { 
            const {id,role}=req.query
            const data={
                id,role
            }
            
        const response = await getConverstationsUseCase(dependecies).executeFunction(data);
        

        if ( response.status ) {
            res.json({ status: true, data: response.data });
    
        } else {
            res.json({ status: false, message: "Data not found" ,data:[]});
        }
    } catch (error) {
        logger.error(error)
      
        res.status(500).json({ status: false, message: "Internal server error" });
    }
    
  };
  return getConverstationsController;
};
