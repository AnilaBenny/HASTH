import mongoose from "mongoose";

const adminSchema=new mongoose.Schema({
name:{
    type:String
},
email:{
    type:String
},
password:{
    type:String
}
});
const Admin=mongoose.model('Admin',adminSchema);
export{
    Admin
}
