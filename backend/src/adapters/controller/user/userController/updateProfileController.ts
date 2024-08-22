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
                    const { password, ...sanitizedData } = response.data.toObject
            ? response.data.toObject()
            : response.data;
                    res.json({ status: true, data: sanitizedData });
                } else {
                    res.json({ status: false, message: 'Profile updation failed' });
                }
           
       
    };

    return updateProfile;
};
