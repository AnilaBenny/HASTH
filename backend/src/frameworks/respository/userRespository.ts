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
        zipcode,
        role,
      } = data;

      const user = new databaseSchema.User({
        name,
        email,
        password,
        mobile,
        skills,
        education,
        specification,
        address: [{ street, city, state, zipCode: zipcode }], 
        role,
        isVerified:true
      });

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
  }
};


