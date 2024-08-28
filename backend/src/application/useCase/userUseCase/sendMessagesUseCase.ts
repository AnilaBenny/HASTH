export default function sendMessegesUseCase(dependencies: any) {
    const { userRespository}=dependencies.respository;

    const executeFunction = async (data: any) => {
        console.log(data);
        

        const response = await userRespository.sendMesseges(data)
  

        if (response.status) {
            return { status: true, data: response.data };
        } else {
            return { status: false, message: response.message };
        }

    };

    return { executeFunction };
}
