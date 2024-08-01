import express from "express";

import { userController } from "../../controller/user/userController";
import { adminController } from "../../controller/admin/adminController";
import {creativeController} from "../../controller/creative/creativeController"
export default  (dependencies:any)=>{
const router=express.Router();

  router.post('/login',);
  router.post('/register', );
  router.post('/verifyOtp', );
  router.get('/logout', );
  router.get('/resendOtp',);
  router.post('/generateOtp');
  router.post('/checkOTP')
  router.post('/changePassword')
  router.post('/forgotPassword')

}