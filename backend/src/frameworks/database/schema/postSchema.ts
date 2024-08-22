import mongoose, { Schema, Document,model } from 'mongoose';

const CommentSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {type: String },
  liked: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  },
  replies: [
    {
      text: {  type: String },
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});


const PostSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  caption: {
    type: String,
    required: true
  },
  images: {
    type: [String],
    default: []
  },
  liked: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    default: []
  },
  video: {
    type: String,
    default: null
  },
  comments: {
    type: [CommentSchema],
    default: []
  },
  tags: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

PostSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Post=model('Post', PostSchema);

export{
    Post
}