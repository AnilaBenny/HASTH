import express from "express";

import { userController,adminController,} from "../../controller";





export default  (dependencies:any)=>{
const router=express();
const { 
  registrationController,otpController,loginController,forgotPasswordController,checkOtpController,updatePasswordController,resendOtpController,
  updateProfileController
}=userController(dependencies);


  router.post('/login',loginController);
  router.post('/register',registrationController);
  router.post('/verifyOtp',otpController);
  router.post('/forgotPassword',forgotPasswordController);
  router.post('/checkOtp',checkOtpController);
  router.put('/resetPassword',updatePasswordController);
  router.post('/resendOtp',resendOtpController);
  router.post('/updateProfile',updateProfileController);

const { 
  AdminLoginController,getAllUserController,handleUserBlockController,
}=adminController(dependencies);
router.post('/admin/login',AdminLoginController);
router.get('/getAllUsers',getAllUserController);
router.put('/handleUserBlock/:userId',handleUserBlockController);
router.post('/verifyCreative')

return router;
}