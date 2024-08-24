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
  likedController,commentController,reportController,addProductController,getCreatorsController,getProductsController,
  editPostController,editProductController,deletePostController,statusProductController,commentReplyController,
  pinCommentController,addtocartController,removecartitemController,razorpayController,orderController
}=userController(dependencies);


  router.post('/login',loginController);
  router.post('/register',registrationController);
  router.post('/verifyOtp',otpController);
  router.post('/forgotPassword',forgotPasswordController);
  router.post('/checkOtp',checkOtpController);
  router.put('/resetPassword',updatePasswordController);
  router.post('/resendOtp',resendOtpController);
  router.put('/updateProfile',updateProfileController);
  router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  router.get('/google/callback',passport.authenticate('google'),googleRegisterController);
  router.post('/refresh-token',refreshTokenController);
  router.post('/innovation',upload.fields([{ name: 'images' }, { name: 'video' }]),addInnovationController);
  router.get('/posts',getPostController);
  router.post('/liked',likedController);
  router.post('/comment',commentController);
  router.post('/report',reportController);
  router.put('/editIdea',upload.fields([{ name: 'images' }, { name: 'video' }]),editPostController);
  router.delete('/deleteIdea/:postId',deletePostController);
  router.post('/addProduct',upload.fields([{ name: 'images' }]),addProductController);
  router.get('/products',getProductsController);
  router.get('/creators',getCreatorsController);
  router.put('/editProduct',upload.fields([{ name: 'images' }]),editProductController);
  router.patch('/deleteProduct/:productId',statusProductController);
  router.post('/reply',commentReplyController);
  router.patch('/pinComment',pinCommentController);
  router.post('/addtocart',addtocartController);
  router.post('/removecartitem',removecartitemController);
  router.post('/order/createOnlineOrder',razorpayController);
  router.post('/order',orderController);
  

 
  
const { 
  AdminLoginController,getAllUserController,handleUserBlockController,
  verifyCreativeController,getReportsController
}=adminController(dependencies);
router.post('/admin/login',AdminLoginController);
router.get('/getAllUsers',getAllUserController);
router.patch('/handleUserBlock/:userId',handleUserBlockController);
router.patch('/verifyCreative/:userId',verifyCreativeController);
router.get('/reports',getReportsController);

return router;
}