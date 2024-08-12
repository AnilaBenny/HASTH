import { databaseSchema } from "../database"; 

export default  {
  createUser: async (data: any) => {
    try {
      console.log(data);
      
      const {
        name,
        email,
        password,
        mobile,
        skills,
        education,
        specification,
        street,
        city,
        state,
        zipCode,
        role,
      } = data;
      let user;
      if(role==='user'){
         user = new databaseSchema.User({
          name,
          email,
          password,
          mobile,
          skills,
          education,
          specification,
          address: [{ street, city, state, zipCode: zipCode }], 
          role,
          isVerified:true
        });
      }else{
         user = new databaseSchema.User({
          name,
          email,
          password,
          mobile,
          skills,
          education,
          specification,
          address: [{ street, city, state, zipCode: zipCode }], 
          role,
          isVerified:false
        });
      }
     

      const response = await user.save();
      if (response) {
        return { status: true, data: response };
      } else {
        return { status: false, message: "User creation failed" }; 
      }
    } catch (error) {
      console.error("Error in userService.createUser:", error);
      return { status: false, message: "Internal server error" }; 
    }
  },

  getUserByEmail: async (data: any) => {
    try {
      const { email } = data;
      const user = await databaseSchema.User.findOne({ email });
      if (user) {
        return { status: true, data: user };
      } else {
        return { status: false, message: "User not found" };
      }
    } catch (error) {
      console.error("Error in userService.getUserByEmail:", error);
      throw new Error("Internal server error"); 
    }
  },
  finduser: async (email: any) => {
    try {
     

      const finduser = await databaseSchema.User.findOne({
        email: email,
      });
      ;
      if (finduser) {
        return { status: true, user: finduser };
      } else {
        return { status: false,message:'user not found'};
      }
    } catch (error) {
      console.log(
        "error in repositery authencation repo in userEmailexist",
        error
      );
    }
  },
  forgotPassword:async(email:any)=>{
    
    
    try{
      const finduser = await databaseSchema.User.findOne({
        email: email,
      });
      console.log(finduser,email);
      
      if (finduser) {
        return { status: true, data: finduser };
      } else {
        return { status: false, message: "User not found" };
      }

    }catch (error) {
      console.error("Error in userRespository.forgotPassword:", error);
      throw new Error("Internal server error"); 
    }
  },
  updatePassword:async(data:any)=>{
    try{
      const {email,password}=data
      const updateUser = await databaseSchema.User.findOneAndUpdate({
        email: email,
      },{password:password});
      if(updateUser){
        return { status: true, message:'Password updated' };
      } else {
        return { status: false, message: "User not found" };
      }

    }catch(error){
      console.error('Error in userRespository.updatePassword',error);
      throw new Error('Internal server error')
    }
  },
  updateProfile:async(data:any)=>{
    try {
      const {
        name,
        email,
        mobile,
        skills,
        education,
        specification,
        street,
        city,
        state,
        zipCode,
        role,
      } = data;
      const address = { street, city, state, zipCode };
      const user = await databaseSchema.User.findOneAndUpdate(
        { email: email }, 
        {
          $set: {
            name,
            mobile,
            skills,
            education,
            specification,
            address,
            role,
          },
        },
        { new: true } 
      );
   
      if (user) {
        return { status: true, data: user };
      } else {
        return { status: false, message: "Profile updation failed" }; 
      }
    } catch (error) {
      console.error("Error in userRespository.updateProfile:", error);
      return { status: false, message: "Internal server error" }; 
    }
  }
};


