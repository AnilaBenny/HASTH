

import mongoose, { Schema } from 'mongoose';

const conversationSchema = new mongoose.Schema({
    members: [{
       userId:{ type: Schema.Types.ObjectId, required: true,role:'user', ref: "User" },
       creativeId:{ type: Schema.Types.ObjectId, required: true,role:'creative', ref: "User" },
    }],
    lastUpdate: {
        type: Date,
        default: Date.now()
    },
    unreadMessageCount: Number,
});

const Conversation = mongoose.model('conversation', conversationSchema);

export {
    Conversation
}
