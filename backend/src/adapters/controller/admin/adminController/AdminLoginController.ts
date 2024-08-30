import { Request,Response } from "express"
import { access } from "node:fs";
import generateToken from "../../../../utils/generateToken";
export default (dependencies:any)=>{
const AdminLoginController=async(req:Request,res:Response)=>{
try{
    const {email,password}=req.body;
const {AdminloginUseCase}=dependencies.useCase;
const data:any={
    email,password
}
const execute=await AdminloginUseCase(dependencies);
const response=await execute.executeFunction(data);

if (response.status) {
    const token=await generateToken(data);
     res.json({ status: true, data: response,accessToken:response.accessToken})
  } else {
     res.json({ status: false, message: response.message })
  }

}catch(err){
console.log(err);

}
}
return AdminLoginController
}

