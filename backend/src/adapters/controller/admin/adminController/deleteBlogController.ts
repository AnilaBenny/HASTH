import { Request,Response } from "express"
import logger from "../../../../logger";
export default (dependencies:any)=>{
const deleteBlogController=async(req:Request,res:Response)=>{
try{
 
const {deleteBlogUseCase}=dependencies.useCase;
const blogId=req.params.id
const execute=await deleteBlogUseCase(dependencies);
const response=await execute.executeFunction(blogId);

if (response.status) {
     res.json({ status: true, data: response})
  } else {
     res.json({ status: false, message: response.message })
  }

}catch(err){
console.error('deleteBlog',err);
}
}
return deleteBlogController
}

