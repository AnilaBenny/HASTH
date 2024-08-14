import express from "express";

import { userController,adminController,} from "../../controller";
import passport from "passport";
import { middleware } from "../../../utils/middleware/middleware";
import { upload } from "../../../utils";
export default  (dependencies:any)=>{
const router=express();
const { 
  registrationController,otpController,loginController,forgotPasswordController,checkOtpController,updatePasswordController,resendOtpController,
  updateProfileController,googleRegisterController,refreshTokenController,addInnovationController,getPostController,
  likedController,commentController
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
  router.post('/innovation',upload.fields([{ name: 'images' }, { name: 'video' }]),addInnovationController);
  router.get('/posts',getPostController);
  router.post('/liked',likedController);
  router.post('/comment',commentController);
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
router.patch('/handleUserBlock/:userId',handleUserBlockController);
router.patch('/verifyCreative/:userId',verifyCreativeController)

return router;
}