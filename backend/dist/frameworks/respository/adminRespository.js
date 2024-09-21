"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
exports.default = {
    verifyAdmin: (email, password) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log(email, password);
            const Admin = yield database_1.databaseSchema.Admin.findOne({ email });
            if (Admin) {
                if (Admin.password === password) {
                    return { status: true, user: Admin };
                }
                else {
                    return { status: false, message: 'Incorrect password' };
                }
            }
            else {
                return { status: false, message: 'User not found' };
            }
        }
        catch (error) {
            console.log("Error in adminRepository.verifyAdmin", error);
            return { status: false, message: 'Error occurred during verification' };
        }
    }),
    getAllUsers: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const page = data.page || 1;
            const limit = data.limit || 8;
            const skip = (page - 1) * limit;
            const users = yield database_1.databaseSchema.User.find()
                .skip(skip)
                .limit(limit);
            const totalUsers = yield database_1.databaseSchema.User.countDocuments();
            if (users && users.length > 0) {
                return {
                    status: true,
                    data: {
                        users,
                        total: totalUsers,
                        currentPage: page,
                        totalPages: Math.ceil(totalUsers / limit)
                    }
                };
            }
            else {
                return { status: false, message: 'Users not found' };
            }
        }
        catch (error) {
            console.log("Error in adminRepository.getAllUsers", error);
            return { status: false, message: 'Error occurred during get users' };
        }
    }),
    handleUserBlock: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield database_1.databaseSchema.User.findById(userId);
            if (user) {
                user.isBlocked = !user.isBlocked;
                const response = yield user.save();
                if (response) {
                    return { status: true, data: response };
                }
                else {
                    return { status: false, message: "User blocking/unblocking failed" };
                }
            }
            else {
                return { status: false, message: "User not found" };
            }
        }
        catch (error) {
            console.error("Error in handleUserBlock repository:", error);
            return { status: false, message: "User blocking/unblocking failed" };
        }
    }),
    verifyCreative: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield database_1.databaseSchema.User.findById(userId);
            if (user) {
                user.isVerified = !user.isVerified;
                const response = yield user.save();
                if (response) {
                    return { status: true, data: response };
                }
                else {
                    return { status: false, message: "creative verification failed" };
                }
            }
            else {
                return { status: false, message: "creative not found" };
            }
        }
        catch (error) {
            console.error("Error in verifyCreative repository:", error);
            return { status: false, message: "creative verification failed" };
        }
    }),
    getAllReports: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const page = data.page || 1;
            const limit = data.limit || 8;
            const skip = (page - 1) * limit;
            const reports = yield database_1.databaseSchema.Report.find()
                .populate({
                path: 'reportedPostId',
                populate: {
                    path: 'userId'
                }
            }).populate('reportedUserId')
                .skip(skip)
                .limit(limit);
            const totalReports = yield database_1.databaseSchema.Report.countDocuments();
            if (reports && reports.length > 0) {
                return {
                    status: true,
                    data: {
                        reports,
                        total: totalReports,
                        currentPage: page,
                        totalPages: Math.ceil(totalReports / limit)
                    }
                };
            }
            else {
                return { status: false, message: 'reports not found' };
            }
        }
        catch (error) {
            console.log("Error in adminRepository.getAllreports", error);
            return { status: false, message: 'Error occurred during get reports' };
        }
    }),
    getAllOrders: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const page = data.page || 1;
            const limit = data.limit || 8;
            const skip = (page - 1) * limit;
            const orders = yield database_1.databaseSchema.Order.find().populate('items.product').populate('userId')
                .skip(skip)
                .limit(limit);
            console.log(orders);
            const totalOrders = yield database_1.databaseSchema.Order.countDocuments();
            if (orders && orders.length > 0) {
                return {
                    status: true,
                    data: {
                        orders,
                        total: totalOrders,
                        currentPage: page,
                        totalPages: Math.ceil(totalOrders / limit)
                    }
                };
            }
            else {
                return { status: false, message: 'Orders not found' };
            }
        }
        catch (error) {
            console.log("Error in adminRepository.getAllOrders", error);
            return { status: false, message: 'Error occurred during get orders' };
        }
    }),
    createBlog: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { title, content, image } = data;
            const blog = new database_1.databaseSchema.Blog({
                title,
                content,
                image
            });
            yield blog.save();
            const blogs = yield database_1.databaseSchema.Blog.find().sort({ createdAt: -1 });
            return blogs;
        }
        catch (error) {
            console.error("Error creating blog:", error);
            throw new Error("Failed to create blog");
        }
    }),
    getAllBlogs: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const page = data.page || 1;
            const limit = data.limit || 8;
            const skip = (page - 1) * limit;
            const Blogs = yield database_1.databaseSchema.Blog.find().sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
            const totalBlogs = yield database_1.databaseSchema.Blog.countDocuments();
            if (Blogs && Blogs.length > 0) {
                return {
                    status: true,
                    data: {
                        Blogs,
                        total: totalBlogs,
                        currentPage: page,
                        totalPages: Math.ceil(totalBlogs / limit)
                    }
                };
            }
            else {
                return { status: false, message: 'Blogs not found' };
            }
        }
        catch (error) {
            console.log("Error in adminRepository.allBlogs", error);
            return { status: false, message: 'Error occurred during get Blogs' };
        }
    }),
    deleteBlog: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const blog = yield database_1.databaseSchema.Blog.findByIdAndDelete(data);
            if (blog) {
                const blogs = yield database_1.databaseSchema.Blog.find();
                return { status: true, message: 'Blog deleted successfully', data: blogs };
            }
            else {
                return { status: false, message: 'Blog not found' };
            }
        }
        catch (error) {
            return { status: false, message: 'Error deleting blog' };
        }
    })
};
