import mongoose, { Schema, model } from 'mongoose';

const productSchema = new Schema({
   userId:{
      type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
   },
   name: {
      type: String,
      required: true,
      
   },

   description: {
      type: String,
      required: true
   },
   collab:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
   }
,
   images:[{
      type:String
   }],

   brand:{
      type:String
   },

   countInStock: {
      type: Number,
      required: true,
      min: 0,
      max: 300
   },

   review: [
      {
          user: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'user'
          },
          rating: {
              type: Number,
              default: 0
          },
          reviewdescription: {
              type: String
          }
      },
  ],

   isFeatured: {
      type: Boolean,
      default: true
   },
   price: {
      type: Number,
      required: true,
      default: 0,

   },
   popularity:{
      type:Number,
      default: 0

   },
   list:{
      type: Boolean,
      default: true
   }   
}, {
   timestamps: true
})

const Product = model('Product', productSchema);

export {
    Product
};
