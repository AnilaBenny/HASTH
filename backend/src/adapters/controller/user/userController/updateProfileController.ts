import { Request, Response } from 'express';


export default (dependencies: any) => {
    const { updateProfileUseCase } = dependencies.useCase;

    const updateProfile = async (req: Request, res: Response) => {
       
       
        const data = req.body;
        
        console.log(data);
     
                const executionFunction = await updateProfileUseCase(dependencies);
                console.log(executionFunction);
                const response=await executionFunction.executionFunction(data);
                if (response.status) {
                    res.json({ status: true, data: response.data });
                } else {
                    res.json({ status: false, message: 'Profile updation failed' });
                }
           
       
    };

    return updateProfile;
};
