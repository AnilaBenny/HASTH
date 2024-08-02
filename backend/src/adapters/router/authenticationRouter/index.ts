import express from "express";

import { userController } from "../../controller";

export default  (dependencies:any)=>{
const router=express();
const { registrationController }=userController(dependencies);
// const { }=adminController(dependencies)

  router.post('/login',);
  router.post('/register',registrationController);
  router.post('/verifyOtp', );
  router.get('/logout', );
  router.get('/resendOtp',);
  router.post('/generateOtp');
  router.post('/checkOTP')
  router.post('/changePassword')
  router.post('/forgotPassword')
return router;
}