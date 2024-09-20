import { Request,Response } from "express"
import logger from "../../../../logger";
export default (dependencies:any)=>{
const createBlogController=async(req:Request,res:Response)=>{
try{
 
   
const {CreateBlogUseCase}=dependencies.useCase;
const image = req.file ? req.file.filename : null;
const data={
   title:req.body.title,
   image,
   content:req.body.content
}
const execute=await CreateBlogUseCase(dependencies);
const response=await execute.executeFunction(data);

if (response.status) {
     res.json({ status: true, data: response.data})
  } else {
     res.json({ status: false, message: response.message })
  }

}catch(err){
console.error('createBlog');
}
}
return createBlogController
}

