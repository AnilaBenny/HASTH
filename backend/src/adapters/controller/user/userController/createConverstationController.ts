import { Request, Response } from "express";
import logger from "../../../../logger";
export default (dependecies: any) => {


    const { createConverstationUseCase } = dependecies.useCase
    const createConverstationController = async (req: Request, res: Response) => {

        try {
            const { senderId, recieverId } = req.body
            const data = {
                senderId, recieverId
            }

            const response = await createConverstationUseCase(dependecies).executeFunction(data);
            
            console.log(response);
            

            if ( response.status) {
                res.json({ status: true, data: response.data });
            } else {
                res.json({ status: false, data: response.data });
            }
        } catch (error) {
            logger.error(error)
            res.status(500).json({ status: false, message: "Internal server error" });
        }

    };
    return createConverstationController;
};
