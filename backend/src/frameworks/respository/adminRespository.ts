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
  getAllUsers:async(data:any)=>{
    try {

      const page = data.page || 1;
      const limit = data.limit || 8;
      const skip = (page - 1) * limit;

      const users = await databaseSchema.User.find()
          .skip(skip)
          .limit(limit);

  
      const totalUsers = await databaseSchema.User.countDocuments();

      if (users && users.length > 0) {
        
        
          return {
              status: true,
              data: {
                  users,
                  total: totalUsers,
                  currentPage: page,
                  totalPages: Math.ceil(totalUsers / limit)
              }
          };
          
      } else {
          return { status: false, message: 'Users not found' };
      }
  } catch (error) {
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
  },
  verifyCreative:async(userId:string)=>{
    try{
    const user = await databaseSchema.User.findById(userId);
      if (user) {
        user.isVerified = !user.isVerified; 
        
        const response = await user.save();
        if (response) {
          return { status: true, data: response };
        } else {
          return { status: false, message: "creative verification failed" };
        }
      } else {
        return { status: false, message: "creative not found" };
      }
    } catch (error) {
      console.error("Error in verifyCreative repository:", error);
      return { status: false, message: "creative verification failed" };
    }
  },
  getAllReports:async(data:any)=>{
    try {

      const page = data.page || 1;
      const limit = data.limit || 8;
      const skip = (page - 1) * limit;

      const reports = await databaseSchema.Report.find()
  .populate({
    path: 'reportedPostId',
    populate: {
      path: 'userId'  
    }
  }).populate('reportedUserId')
  .skip(skip)
  .limit(limit);


  
      const totalReports = await databaseSchema.Report.countDocuments();

      if (reports && reports.length > 0) {
        
        
          return {
              status: true,
              data: {
                reports,
                  total: totalReports,
                  currentPage: page,
                  totalPages: Math.ceil(totalReports / limit)
              }
          };
          
      } else {
          return { status: false, message: 'reports not found' };
      }
  } catch (error) {
      console.log("Error in adminRepository.getAllreports", error);
      return { status: false, message: 'Error occurred during get reports' };
  }
  },
  getAllOrders:async(data:any)=>{
    try {

      const page = data.page || 1;
      const limit = data.limit || 8;
      const skip = (page - 1) * limit;

      const orders = await databaseSchema.Order.find().populate('items.product').populate('userId')
          .skip(skip)
          .limit(limit);
          console.log(orders);
          

  
      const totalOrders = await databaseSchema.Order.countDocuments();

      if (orders && orders.length > 0) {
        
        
          return {
              status: true,
              data: {
                orders,
                  total: totalOrders,
                  currentPage: page,
                  totalPages: Math.ceil(totalOrders / limit)
              }
          };
          
      } else {
          return { status: false, message: 'Orders not found' };
      }
  } catch (error) {
      console.log("Error in adminRepository.getAllOrders", error);
      return { status: false, message: 'Error occurred during get orders' };
  }},
};
