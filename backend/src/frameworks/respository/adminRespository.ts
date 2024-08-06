import { databaseSchema } from "../database";

export default {
  verifyAdmin: async (email: string, password: string) => {
    try {
      console.log(email,password);
      
      const Admin = await databaseSchema.Admin.findOne({email});
     
      
      if (Admin) {
        if (Admin.password === password) {
          return { status: true, user: Admin };
        } else {
          return { status: false, message: 'Incorrect password' };
        }
      } else {
        return { status: false, message: 'User not found' };
      }
    } catch (error) {
      console.log("Error in adminRepository.verifyAdmin", error);
      return { status: false, message: 'Error occurred during verification' };
    }
  },
  getAllUsers:async()=>{
    try{
      const users=await databaseSchema.User.find()
      console.log(users);
      
      if(users){
        return {status:true,data:users}
      }else{
        return {status:false,message:'users not found'}
      }
    }catch(error){
      console.log("Error in adminRepository.getAllUsers", error);
      return { status: false, message: 'Error occurred during get users' };
    }
  },
  handleUserBlock: async (userId: string) => {
    try {
      const user = await databaseSchema.User.findById(userId);
      if (user) {
        user.isBlocked = !user.isBlocked; 
        const response = await user.save();
        if (response) {
          return { status: true, data: response };
        } else {
          return { status: false, message: "User blocking/unblocking failed" };
        }
      } else {
        return { status: false, message: "User not found" };
      }
    } catch (error) {
      console.error("Error in handleUserBlock repository:", error);
      return { status: false, message: "User blocking/unblocking failed" };
    }
  }
};
