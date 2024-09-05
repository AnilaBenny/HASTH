import { Request, Response } from "express";

export default (dependencies: any) => {
    const { allListNumberUseCase } = dependencies.useCase;

    const allListNumberController = async (req: Request, res: Response) => {
        try {
            const data = req.query.timeFrame;

            const response = await allListNumberUseCase(dependencies).executeFunction(data)
   
            if (response && response.status && response.data) {
                res.json({ status: true, data: response.data });

            } else {
                res.json({ status: false, message: "Data not found" });
            }

        } catch (error) {

        }
    };


    return allListNumberController;
};
