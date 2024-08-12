import express from "express";

import { userController,adminController,} from "../../controller";
import passport from "passport";
import { middleware } from "../../../utils/middleware/middleware";
export default  (dependencies:any)=>{
const router=express();
const { 
  registrationController,otpController,loginController,forgotPasswordController,checkOtpController,updatePasswordController,resendOtpController,
  updateProfileController,googleRegisterController,refreshTokenController
}=userController(dependencies);


  router.post('/login',loginController);
  router.post('/register',registrationController);
  router.post('/verifyOtp',otpController);
  router.post('/forgotPassword',forgotPasswordController);
  router.post('/checkOtp',checkOtpController);
  router.put('/resetPassword',updatePasswordController);
  router.post('/resendOtp',resendOtpController);
  router.post('/updateProfile',middleware,updateProfileController);
  router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  router.get('/google/callback',passport.authenticate('google'),googleRegisterController);
  router.post('/refresh-token',refreshTokenController);
  router.post('/ideaSubmission');
  router.get('/getIdeas');
  router.post('/editIdea');
  router.delete('/deleteIdea');
  // router.post('/product')
  // router.post('/editProduct')
  // router.delete('/deleteProduct')
  // router.get('/productListing')
 
  
const { 
  AdminLoginController,getAllUserController,handleUserBlockController,
  verifyCreativeController
}=adminController(dependencies);
router.post('/admin/login',AdminLoginController);
router.get('/getAllUsers',getAllUserController);
router.put('/handleUserBlock/:userId',handleUserBlockController);
router.post('/verifyCreative',verifyCreativeController)

return router;
}