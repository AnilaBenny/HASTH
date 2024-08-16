import mongoose, { Schema, model } from 'mongoose';

const reportSchema = new Schema({
  reportedUserId: {
    type: Schema.Types.ObjectId, 
    ref: 'User', 
  },
  reportedPostId: {
    type: Schema.Types.ObjectId, 
    ref: 'Post', 
  },
  reportedCommentId: {
    type: Schema.Types.ObjectId, 
    ref: 'Comment', 
  },
  type: {
    type: String, 
    required: true,
    enum: ['post', 'comment', 'user'],
  },
  reason: {
    type: String, 
    required: true,
  },
  status: {
    type: Boolean, 
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Report = model('Report', reportSchema);

export {
  Report
};
