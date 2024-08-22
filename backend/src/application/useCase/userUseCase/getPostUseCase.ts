export default (dependencies: any)=> {
    const {  userRespository } = dependencies.respository;

    const executeFunction = async (page:any) => {
        try {
            const response = await userRespository.getPosts(page);
           
          
            if (response.status) {
                return { status: true, data: response.data };
            } else {
                return { status: false, message: response.message };
            }
        } catch (error) {
            console.log(error);
            return { status: false, message: "Error in getPost use case" };
        }
    };

    return { executeFunction:executeFunction };
}
