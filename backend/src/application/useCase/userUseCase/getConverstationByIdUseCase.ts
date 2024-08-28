export default function getConverstationByIdUseCase(dependencies: any) {
    const { userRespository } = dependencies.respository;

    const executeFunction = async (data: any) => {
        try {
            
            const response = await userRespository.getConverstationById(data);
            
            if (response.status) {
                return { status: true, data: response.data };
            } else {
                return { status: false, message: response.message };
            }
        } catch (error) {
            console.log(error);
            return { status: false, message: "Error in getConverstationByIdUseCase" };
        }
    };

    return { executeFunction };
}
