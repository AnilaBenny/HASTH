import express from "express";

import { userController,adminController,} from "../../controller";



export default  (dependencies:any)=>{
const router=express();
const { registrationController,otpController,loginController }=userController(dependencies);


  router.post('/login',loginController);
  router.post('/register',registrationController);
  router.post('/verifyOtp',otpController);
  router.post('/checkOTP');
  router.get('/resendOtp');
  router.get('/logout',);
 
  router.post('/generateOtp');
 
  router.post('/changePassword')
  router.post('/forgotPassword')

const { AdminLoginController,getAllUserController,handleUserBlockController}=adminController(dependencies);
router.post('/admin/login',AdminLoginController);
router.get('/getAllUsers',getAllUserController);
router.put('/handleUserBlock/:userId',handleUserBlockController)

return router;
}