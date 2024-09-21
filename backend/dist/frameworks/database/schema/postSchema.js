"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const mongoose_1 = require("mongoose");
const CommentSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    isPinned: { type: Boolean, default: false },
    text: { type: String },
    liked: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: 'User',
        default: [],
    },
    replies: [
        {
            text: { type: String },
            userId: {
                type: mongoose_1.Schema.Types.ObjectId,
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
const PostSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        type: [mongoose_1.Schema.Types.ObjectId],
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
PostSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});
const Post = (0, mongoose_1.model)('Post', PostSchema);
exports.Post = Post;
