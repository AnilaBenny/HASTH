import express from "express";

import { userController} from "../../controller";

export default  (dependencies:any)=>{
const router=express();
const { registrationController,otpController }=userController(dependencies);


  router.post('/login',);
  router.post('/register',registrationController);
  router.post('/verifyOtp',otpController);
  router.post('/checkOTP');
  router.get('/resendOtp');
  router.get('/logout', );
 
  router.post('/generateOtp');
 
  router.post('/changePassword')
  router.post('/forgotPassword')
return router;
}