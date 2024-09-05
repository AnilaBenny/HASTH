import mongoose, { Schema, model } from 'mongoose';

const userSchema = new Schema({
  name: {
    type: String,
    
  },
  password: {
    type: String,
    
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: Number,
 
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  image: {
    type: String,
  },
  role: {
    type: String,
    enum: ['creative', 'user'], 
    default: 'user',
  },
  skills: {
    type: String,
  },
  education: {
    type: String,
  },
  specification: {
    type: String,
  },
  address: [
    {
      street: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      zipCode: {
        type: String,
      },
    },
  ],
  supercoin: {
    balance:{
      type: Number,
      default: 0
    },
    updatedAt:{
      type: Date,
    default: Date.now,    
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});



const User = model('User', userSchema);

export {
  User
};
