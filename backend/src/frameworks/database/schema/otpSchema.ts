import mongoose from "mongoose";

const otpSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    otpCode:{
        type:String
    },
    updatedAt: {
        type: Date,
        default: Date.now, 
      }
})

const Otp=mongoose.model('Otp',otpSchema);
export{
    Otp
}