"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userSchema_1 = require("./userSchema");
const adminSchema_1 = require("./adminSchema");
const otpSchema_1 = require("./otpSchema");
const postSchema_1 = require("./postSchema");
const reportSchema_1 = require("./reportSchema");
const productSchema_1 = require("./productSchema");
const cartSchema_1 = require("./cartSchema");
const orderSchema_1 = require("./orderSchema");
const RealTimeChatSchema_1 = require("./RealTimeChatSchema");
const conversationSchema_1 = require("./conversationSchema");
const BlogSchema_1 = require("./BlogSchema");
const databaseSchema = {
    User: userSchema_1.User,
    Admin: adminSchema_1.Admin,
    Otp: otpSchema_1.Otp,
    Post: postSchema_1.Post,
    Report: reportSchema_1.Report,
    Product: productSchema_1.Product,
    Cart: cartSchema_1.Cart,
    Order: orderSchema_1.Order,
    RealTimeChat: RealTimeChatSchema_1.RealTimeChat,
    Conversation: conversationSchema_1.Conversation,
    Blog: BlogSchema_1.Blog
};
exports.default = databaseSchema;
