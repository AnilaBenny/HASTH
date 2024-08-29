
export default function sendAudioUseCase(dependencies: any) {
    const { userRespository } = dependencies.respository;

    const executeFunction = async (data: any) => {

        const response = await userRespository.sendAudio(data)
      

        if (response.status) {
            return { status: true, data: response.data };
        } else {
            return { status: false, message: response.message };
        }

    };

    return { executeFunction };
}
