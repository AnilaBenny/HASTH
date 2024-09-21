"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Report = void 0;
const mongoose_1 = require("mongoose");
const reportSchema = new mongoose_1.Schema({
    reportedUserId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    reportedPostId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Post',
    },
    reportedCommentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Comment',
    },
    type: {
        type: String,
        required: true,
        enum: ['post', 'comment', 'creative'],
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
const Report = (0, mongoose_1.model)('Report', reportSchema);
exports.Report = Report;
