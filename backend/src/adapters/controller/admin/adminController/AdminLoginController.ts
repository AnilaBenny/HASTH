import { Request,Response } from "express"
export default (dependencies:any)=>{
const AdminLoginController=async(req:Request,res:Response)=>{
try{
    const {email,password}=req.body;
const {AdminloginUseCase}=dependencies.useCase;
const data={
    email,password
}
const execute=await AdminloginUseCase(dependencies);
const response=await execute.executeFunction(data);

if (response.status) {
     res.json({ status: true, data: response})
  } else {
     res.json({ status: false, message: response.message })
  }

}catch(err){
console.log(err);

}
}
return AdminLoginController
}

