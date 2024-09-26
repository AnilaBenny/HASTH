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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../../logger"));
const database_1 = require("../database");
exports.default = {
    createUser: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log(data);
            const { name, email, password, mobile, skills, education, specification, street, city, state, zipCode, role, image } = data;
            let user;
            if (role === 'user') {
                user = new database_1.databaseSchema.User({
                    name,
                    email,
                    password,
                    mobile,
                    skills,
                    education,
                    specification,
                    address: [{ street, city, state, zipCode }],
                    role,
                    image,
                    isVerified: true
                });
            }
            else {
                user = new database_1.databaseSchema.User({
                    name,
                    email,
                    password,
                    mobile,
                    skills,
                    education,
                    image,
                    specification,
                    address: [{ street, city, state, zipCode }],
                    role,
                    isVerified: false
                });
            }
            const response = yield user.save();
            if (response) {
                return { status: true, data: response };
            }
            else {
                return { status: false, message: "User creation failed" };
            }
        }
        catch (error) {
            console.error("Error in userService.createUser:", error);
            return { status: false, message: "Internal server error" };
        }
    }),
    getUserByEmail: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email } = data;
            const user = yield database_1.databaseSchema.User.findOne({ email });
            if (user) {
                return { status: true, data: user };
            }
            else {
                return { status: false, message: "User not found" };
            }
        }
        catch (error) {
            console.error("Error in userService.getUserByEmail:", error);
            throw new Error("Internal server error");
        }
    }),
    finduser: (email) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const finduser = yield database_1.databaseSchema.User.findOne({
                email: email,
            });
            ;
            if (finduser) {
                return { status: true, user: finduser };
            }
            else {
                return { status: false, message: 'user not found' };
            }
        }
        catch (error) {
            console.log("error in repositery authencation repo in userEmailexist", error);
        }
    }),
    forgotPassword: (email) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const finduser = yield database_1.databaseSchema.User.findOne({
                email: email,
            });
            console.log(finduser, email);
            if (finduser) {
                return { status: true, data: finduser };
            }
            else {
                return { status: false, message: "User not found" };
            }
        }
        catch (error) {
            console.error("Error in userRespository.forgotPassword:", error);
            throw new Error("Internal server error");
        }
    }),
    updatePassword: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password } = data;
            const updateUser = yield database_1.databaseSchema.User.findOneAndUpdate({
                email: email,
            }, { password: password });
            if (updateUser) {
                return { status: true, message: 'Password updated' };
            }
            else {
                return { status: false, message: "User not found" };
            }
        }
        catch (error) {
            console.error('Error in userRespository.updatePassword', error);
            throw new Error('Internal server error');
        }
    }),
    updateProfile: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, email, mobile, skills, education, specification, street, city, state, zipCode, role, image, } = data;
            const address = { street, city, state, zipCode };
            const user = yield database_1.databaseSchema.User.findOneAndUpdate({ email: email }, {
                $set: {
                    name,
                    mobile,
                    skills,
                    education,
                    specification,
                    address,
                    role,
                    image
                },
            }, { new: true });
            if (user) {
                return { status: true, data: user };
            }
            else {
                return { status: false, message: "Profile updation failed" };
            }
        }
        catch (error) {
            console.error("Error in userRespository.updateProfile:", error);
            return { status: false, message: "Internal server error" };
        }
    }),
    createPost: (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(data);
        const { userId, caption, images, video, tag } = data;
        try {
            const post = new database_1.databaseSchema.Post({
                userId,
                caption,
                images,
                video,
                tags: tag
            });
            yield post.save();
            const response = yield database_1.databaseSchema.Post.find().sort({ createdAt: -1 }).populate('userId')
                .populate({
                path: 'comments.userId',
            }).populate({
                path: 'comments.replies.userId',
            });
            if (response) {
                return { status: true, data: response };
            }
            else {
                return { status: false, message: "Post creation failed" };
            }
        }
        catch (error) {
            console.error("Error during post creation:", error);
            return { status: false, message: "An error occurred during post creation" };
        }
    }),
    getPosts: (page) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const limit = 6;
            const skip = (page - 1) * limit;
            const posts = yield database_1.databaseSchema.Post.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('userId')
                .populate({
                path: 'comments.userId',
            }).populate({
                path: 'comments.replies.userId',
            });
            return { status: true, data: posts };
        }
        catch (error) {
            console.error('Error fetching posts:', error);
            throw new Error('Unable to fetch posts');
        }
    }),
    likeOrDislikePost: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { postId, userId } = data;
            const post = yield database_1.databaseSchema.Post.findById(postId);
            if (!post) {
                throw new Error('Post not found');
            }
            const userIndex = post.liked.indexOf(userId);
            if (userIndex > -1) {
                post.liked.splice(userIndex, 1);
            }
            else {
                post.liked.push(userId);
            }
            yield post.save();
            return {
                status: true,
                message: userIndex > -1 ? 'Disliked' : 'Liked',
            };
        }
        catch (error) {
            console.error('Error liking or disliking post:', error);
            return {
                status: false,
                message: 'Error processing your request',
            };
        }
    }),
    createComment: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId, postId, text } = data;
            if (!userId || !postId || !text) {
                throw new Error('User ID, Post ID, and text are required');
            }
            const newComment = {
                userId: userId,
                text: text,
                liked: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const updatedPost = yield database_1.databaseSchema.Post.findByIdAndUpdate(postId, { $push: { comments: newComment }, $set: { updatedAt: new Date() } }, { new: true, useFindAndModify: false }).populate('userId')
                .populate({
                path: 'comments.userId',
            });
            if (!updatedPost) {
                throw new Error('Post not found');
            }
            console.log('Comment added successfully');
            return { status: true, data: updatedPost };
        }
        catch (error) {
            console.error('Error creating comment:', error);
            return { status: false, message: 'Error creating comment' };
        }
    }),
    createCommentReply: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId, commentId, postId, text } = data;
            if (!userId || !commentId || !postId || !text) {
                throw new Error('User ID, Comment ID, Post ID, and text are required');
            }
            const updatedPost = yield database_1.databaseSchema.Post.findById(postId)
                .populate('userId')
                .populate({
                path: 'comments.userId',
                select: 'name',
            }).populate({
                path: 'comments.replies.userId',
            });
            if (!updatedPost) {
                throw new Error('Post not found');
            }
            const post = updatedPost;
            const comment = post === null || post === void 0 ? void 0 : post.comments.find((c) => c._id.toString() === commentId);
            if (!comment) {
                throw new Error('Comment not found');
            }
            comment.replies.push({
                userId,
                text,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            yield updatedPost.save();
            console.log('Reply added successfully');
            return { status: true, data: updatedPost };
        }
        catch (error) {
            logger_1.default.error('Error creating comment reply:', error);
            return { status: false, message: 'Error creating comment reply' };
        }
    }),
    createReport: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let newReport;
            data.type === 'post' ?
                newReport = new database_1.databaseSchema.Report({
                    reportedUserId: data.reportedUserId,
                    reportedPostId: data.reportedPostId,
                    reportedCommentId: data.reportedCommentId,
                    type: data.type,
                    reason: data.reason,
                }) : newReport = new database_1.databaseSchema.Report({
                reportedUserId: data.reportedPostId,
                reportedCommentId: data.reportedCommentId,
                type: data.type,
                reason: data.reason,
            });
            const savedReport = yield newReport.save();
            return { status: true, data: savedReport };
        }
        catch (error) {
            console.error('Error creating report:', error);
            return { status: false, message: 'An error occurred during report creation' };
        }
    }),
    createProduct: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, collab, name, description, images, brand, countInStock, price } = data;
        try {
            const product = new database_1.databaseSchema.Product({
                userId, collab, name, description, images, countInStock, price
            });
            const response = yield product.save();
            if (response) {
                return { status: true, data: response };
            }
            else {
                return { status: false, message: "Post creation failed" };
            }
        }
        catch (error) {
            console.error("Error during post creation:", error);
            return { status: false, message: "An error occurred during post creation" };
        }
    }),
    getCreators: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const creators = yield database_1.databaseSchema.User.find({ role: 'creative' });
            if (creators && creators.length > 0) {
                return { status: true, data: creators };
            }
            return { status: false, data: [] };
        }
        catch (error) {
            console.error('Error fetching creators:', error);
            throw new Error('Unable to fetch creators');
        }
    }),
    getProducts: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let products = yield database_1.databaseSchema.Product.find()
                .populate('userId')
                .populate('collab')
                .sort({ createdAt: -1 });
            products = yield Promise.all(products.map((product) => __awaiter(void 0, void 0, void 0, function* () {
                if ((product === null || product === void 0 ? void 0 : product.review) && (product === null || product === void 0 ? void 0 : product.review.length) > 0) {
                    yield product.populate({
                        path: 'review.user',
                        select: 'name'
                    });
                }
                return product;
            })));
            console.log(products);
            return { status: true, data: products };
        }
        catch (error) {
            console.error('Error fetching products:', error);
            throw new Error('Unable to fetch products');
        }
    }),
    editPost: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log(data);
            const { postId, caption, images, video, tags } = data;
            const existingPost = yield database_1.databaseSchema.Post.findById(postId);
            if (!existingPost) {
                return { status: false, message: 'Post not found' };
            }
            existingPost.caption = caption || existingPost.caption;
            existingPost.images = images.length > 0 ? images : existingPost.images;
            existingPost.video = video || existingPost.video;
            existingPost.tags = tags || existingPost.tags;
            const updatedPost = yield existingPost.save();
            return { status: true, data: updatedPost };
        }
        catch (error) {
            console.error('Error editing post:', error);
            return { status: false, message: 'Error editing post' };
        }
    }),
    editProduct: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log(data);
            const { productId, _id, name, description, collab, images, brand, countInStock, isFeatured, price, popularity, list } = data;
            const existingProduct = yield database_1.databaseSchema.Product.findById(_id);
            if (!existingProduct) {
                return { status: false, message: 'Product not found' };
            }
            existingProduct.name = name !== null && name !== void 0 ? name : existingProduct.name;
            existingProduct.description = description !== null && description !== void 0 ? description : existingProduct.description;
            existingProduct.collab = collab !== null && collab !== void 0 ? collab : existingProduct.collab;
            existingProduct.images = images && images.length > 0 ? images : existingProduct.images;
            existingProduct.brand = brand !== null && brand !== void 0 ? brand : existingProduct.brand;
            existingProduct.countInStock = countInStock !== undefined ? countInStock : existingProduct.countInStock;
            existingProduct.isFeatured = isFeatured !== undefined ? isFeatured : existingProduct.isFeatured;
            existingProduct.price = price !== undefined ? price : existingProduct.price;
            existingProduct.popularity = popularity !== undefined ? popularity : existingProduct.popularity;
            existingProduct.list = list !== undefined ? list : existingProduct.list;
            const updatedProduct = yield existingProduct.save();
            return { status: true, data: updatedProduct };
        }
        catch (error) {
            console.error('Error editing product:', error);
            return { status: false, message: 'Error editing product' };
        }
    }),
    deletePost: (postId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield database_1.databaseSchema.Post.findByIdAndDelete(postId);
            return { status: true, message: 'Post deleted successfully' };
        }
        catch (error) {
            console.error('Error deleting post:', error);
            return { status: false, message: 'Error deleting post' };
        }
    }),
    activeordeactiveProduct: (productId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const product = yield database_1.databaseSchema.Product.findById(productId);
            console.log(productId, product);
            if (!product) {
                return { status: false, message: 'Product not found' };
            }
            product.list = !product.list;
            const updatedProduct = yield product.save();
            return {
                status: true,
                data: updatedProduct,
            };
        }
        catch (error) {
            console.error('Error updating product status:', error);
            return { status: false, message: 'Error updating product status' };
        }
    }),
    pinunpinComment: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId, commentId, postId } = data;
            if (!userId || !commentId || !postId) {
                throw new Error('User ID, Comment ID, and Post ID are required');
            }
            const updatedPost = yield database_1.databaseSchema.Post.findById(postId)
                .populate('userId')
                .populate({
                path: 'comments.userId',
                select: 'name',
            })
                .populate({
                path: 'comments.replies.userId',
                select: 'name',
            });
            if (!updatedPost) {
                throw new Error('Post not found');
            }
            const post = updatedPost.comments;
            const comment = post.find((c) => c._id.toString() === commentId);
            if (!comment) {
                throw new Error('Comment not found');
            }
            comment.isPinned = !comment.isPinned;
            yield updatedPost.save();
            return {
                status: true,
                message: `Comment ${comment.isPinned ? 'pinned' : 'unpinned'} successfully`,
                post,
            };
        }
        catch (error) {
            logger_1.default.error('Error in pinunpinComment:', error);
            return {
                status: false,
                message: error,
            };
        }
    }),
    addtocart: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { productId, userId } = data;
            const product = yield database_1.databaseSchema.Product.findById(productId);
            if (!product) {
                return { status: false, message: 'Product not found' };
            }
            if (product.countInStock === 0) {
                return { status: false, message: 'OUT_OF_STOCK' };
            }
            let cart = yield database_1.databaseSchema.Cart.findOne({ userId }).populate('items.productId');
            if (cart) {
                const existingItemIndex = cart.items.findIndex((item) => item.productId._id.toString() === productId.toString());
                if (existingItemIndex !== -1) {
                    if (cart.items[existingItemIndex].quantity >= 5) {
                        return { status: false, message: 'PRODUCT_LIMIT_EXCEEDED' };
                    }
                    cart.items[existingItemIndex].quantity += 1;
                    cart.items[existingItemIndex].price = product.price;
                }
                else {
                    cart.items.push({
                        productId: product._id,
                        quantity: 1,
                        price: product.price
                    });
                }
            }
            else {
                cart = new database_1.databaseSchema.Cart({
                    userId,
                    items: [{
                            productId: product._id,
                            quantity: 1,
                            price: product.price
                        }]
                });
            }
            yield cart.save();
            const populatedCart = yield database_1.databaseSchema.Cart.findById(cart._id)
                .populate('items.productId');
            return { status: true, data: populatedCart };
        }
        catch (error) {
            console.error('Error adding to cart:', error);
            return { status: false, message: 'Error adding to cart' };
        }
    }),
    deleteCartItem: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, itemId } = data;
        const cart = yield database_1.databaseSchema.Cart.findOne({ userId });
        if (!cart) {
            return { status: false, message: 'Cart not found' };
        }
        const itemIndex = cart.items.findIndex(item => { var _a; return item && ((_a = item._id) === null || _a === void 0 ? void 0 : _a.toString()) === itemId; });
        if (itemIndex !== -1) {
            cart.items.splice(itemIndex, 1);
            yield cart.save();
            return { status: true, message: 'Item deleted' };
        }
        else {
            return { status: false, message: 'Item not found in cart' };
        }
    }),
    order: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { cart, paymentMethod, failure } = data;
            if (!cart || !cart.userId) {
                throw new Error('Invalid cart or user ID');
            }
            const orderItems = cart.items.map((item) => ({
                product: item.productId,
                quantity: item.quantity,
                price: item.price,
            }));
            const user = yield database_1.databaseSchema.User.findById(cart.userId);
            if (!user) {
                throw new Error('User not found');
            }
            for (const item of orderItems) {
                const product = yield database_1.databaseSchema.Product.findById(item.product);
                if (!product) {
                    throw new Error(`Product not found for ID: ${item.product}`);
                }
                if (product.countInStock < item.quantity) {
                    throw new Error(`Not enough stock for product: ${product.name}`);
                }
                product.countInStock -= item.quantity;
                product.popularity = (product.popularity || 0) + item.quantity;
                yield product.save();
            }
            let newOrder;
            if (failure) {
                newOrder = new database_1.databaseSchema.Order({
                    userId: user._id,
                    orderId: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
                    items: orderItems,
                    totalAmount: cart.totalPrice,
                    shippingAddress: user.address[0],
                    paymentMethod: paymentMethod,
                    paymentStatus: 'Failed',
                    orderStatus: 'Processing',
                });
            }
            else {
                newOrder = new database_1.databaseSchema.Order({
                    userId: user._id,
                    orderId: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
                    items: orderItems,
                    totalAmount: cart.totalPrice,
                    shippingAddress: user.address[0],
                    paymentMethod: paymentMethod,
                    paymentStatus: 'Paid',
                    orderStatus: 'Processing',
                });
            }
            const savedOrder = yield newOrder.save();
            yield database_1.databaseSchema.Cart.findByIdAndUpdate(cart._id, { items: [], totalPrice: 0 });
            if (savedOrder) {
                return { status: true, data: savedOrder };
            }
            else {
                return { status: false };
            }
        }
        catch (error) {
            logger_1.default.error(error);
            return { status: false, error: error };
        }
    }),
    allorderbyuser: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        const orders = yield database_1.databaseSchema.Order.find({ userId: userId }).populate('items.product');
        return { status: true, data: orders };
    }),
    sendMesseges: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { content, receiverId, senderId, type, conversationId } = data;
            const message = new database_1.databaseSchema.RealTimeChat({
                conversationId: conversationId,
                content: content,
                senderId: senderId,
                receiverId: receiverId,
                type: type,
            });
            const responce = yield message.save();
            yield database_1.databaseSchema.Conversation.findByIdAndUpdate(conversationId, {
                lastUpdate: new Date(),
            }, { new: true });
            if (responce) {
                return { status: true, data: data };
            }
            else {
                return { status: true, message: "Message failed..!" };
            }
        }
        catch (error) {
            console.log(error);
            return { status: true, message: `something went wrong failed ${error}` };
        }
    }),
    sendImage: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { content, receiverId, senderId, type, conversationId } = data;
            const message = new database_1.databaseSchema.RealTimeChat({
                conversationId: conversationId,
                content: content,
                senderId: senderId,
                receiverId: receiverId,
                type: type,
            });
            const responce = yield message.save();
            yield database_1.databaseSchema.Conversation.findByIdAndUpdate(conversationId, {
                lastUpdate: new Date(),
            }, { new: true });
            if (responce) {
                return { status: true, data: data };
            }
            else {
                return { status: true, message: "Message failed..!" };
            }
        }
        catch (error) {
            console.log(error);
            return { status: true, message: `something went wrong failed ${error}` };
        }
    }),
    sendAudio: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { content, receiverId, senderId, type, conversationId } = data;
            const message = new database_1.databaseSchema.RealTimeChat({
                conversationId: conversationId,
                content: content,
                senderId: senderId,
                receiverId: receiverId,
                type: type,
            });
            const responce = yield message.save();
            yield database_1.databaseSchema.Conversation.findByIdAndUpdate(conversationId, {
                lastUpdate: new Date(),
            }, { new: true });
            if (responce) {
                return { status: true, data: data };
            }
            else {
                return { status: true, message: "Message failed..!" };
            }
        }
        catch (error) {
            console.log(error);
            return { status: true, message: `something went wrong failed ${error}` };
        }
    }),
    getConversation: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = data;
            const conversations = yield database_1.databaseSchema.Conversation.find({
                "members": {
                    $elemMatch: {
                        $or: [
                            { senderId: id },
                            { receiverId: id }
                        ]
                    }
                }
            }).sort({ lastUpdate: -1 });
            if (!conversations.length) {
                return { status: true, data: [] };
            }
            const memberIds = conversations.flatMap(conversation => conversation.members.flatMap(member => [member.senderId, member.receiverId]));
            const uniqueMemberIds = [...new Set(memberIds.filter(memberId => memberId.toString() !== id.toString()))];
            const users = yield database_1.databaseSchema.User.find({ _id: { $in: uniqueMemberIds } });
            const userMap = new Map(users.map(user => [user._id.toString(), user]));
            const userConversations = conversations.map(conversation => {
                const otherMember = conversation.members.find(member => member.senderId.toString() !== id.toString() || member.receiverId.toString() !== id.toString());
                const otherUserId = (otherMember === null || otherMember === void 0 ? void 0 : otherMember.senderId.toString()) === id.toString() ?
                    otherMember === null || otherMember === void 0 ? void 0 : otherMember.receiverId : otherMember === null || otherMember === void 0 ? void 0 : otherMember.senderId;
                return {
                    receiver: otherUserId ? userMap.get(otherUserId.toString()) : null,
                    conversation
                };
            });
            return { status: true, data: userConversations };
        }
        catch (error) {
            console.error("An error occurred while fetching conversations:", error);
            return { status: false, message: "An error occurred while fetching conversations" };
        }
    }),
    createConversation: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { senderId, receiverId } = data;
            const existingConversation = yield database_1.databaseSchema.Conversation.findOne({
                members: {
                    $all: [
                        { $elemMatch: { senderId, receiverId } },
                        { $elemMatch: { senderId: receiverId, receiverId: senderId } }
                    ]
                }
            });
            if (existingConversation) {
                return { status: true, data: existingConversation };
            }
            else {
                const conversation = new database_1.databaseSchema.Conversation({
                    members: [
                        { senderId, receiverId },
                        { senderId: receiverId, receiverId: senderId }
                    ]
                });
                const savedConversation = yield conversation.save();
                const message = new database_1.databaseSchema.RealTimeChat({
                    conversationId: savedConversation._id,
                    content: 'Hi buddy, I want to connect with you',
                    senderId,
                    receiverId,
                    type: 'text',
                });
                yield message.save();
                return { status: true, data: savedConversation };
            }
        }
        catch (error) {
            console.error('Error in createConversation:', error);
            return { status: false, message: `Something went wrong: ${error}` };
        }
    }),
    getConverstationById: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = data;
            const response = yield database_1.databaseSchema.RealTimeChat.find({ conversationId: id });
            console.log('ressijnget concersationd', response);
            if (response) {
                return { status: true, data: response };
            }
            else {
                return { status: false, message: "Messages not found ..!" };
            }
        }
        catch (error) {
            console.log(error);
            return { status: false, message: `Messages not found ..!${error}` };
        }
    }),
    cancelOrder: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { OrderId } = data;
        const order = yield database_1.databaseSchema.Order.findById(OrderId).populate('items.product');
        if (!order) {
            return { status: false, message: 'order not found' };
        }
        for (const item of order.items) {
            const product = yield database_1.databaseSchema.Product.findById(item.product);
            if (!product) {
                throw new Error(`Product not found for ID: ${item.product}`);
            }
            product.countInStock += item.quantity;
            product.popularity = (product.popularity || 0) - item.quantity;
            yield product.save();
        }
        order.orderStatus = 'Cancelled';
        yield order.save();
        return { status: true, data: order };
    }),
    updateOrderStatus: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { OrderId, newStatus } = data;
        const order = yield database_1.databaseSchema.Order.findById(OrderId).populate('items.product');
        if (!order) {
            return { status: false, message: 'Order not found' };
        }
        if (newStatus === 'Cancelled') {
            for (const item of order.items) {
                const product = yield database_1.databaseSchema.Product.findById(item.product);
                if (!product) {
                    throw new Error(`Product not found for ID: ${item.product}`);
                }
                product.countInStock += item.quantity;
                product.popularity = (product.popularity || 0) - item.quantity;
                yield product.save();
            }
        }
        if (newStatus === 'Delivered') {
            if (order === null || order === void 0 ? void 0 : order.userId) {
                try {
                    const user = yield database_1.databaseSchema.User.findById(order.userId);
                    if (user) {
                        if (!user.supercoin) {
                            user.supercoin = { balance: 0, updatedAt: new Date() };
                        }
                        const supercoinReward = Math.floor((order.totalAmount || 0) / 10);
                        user.supercoin.balance = (user.supercoin.balance || 0) + supercoinReward;
                        user.supercoin.updatedAt = new Date();
                        yield user.save();
                    }
                }
                catch (error) {
                    console.error('Error updating user supercoin:', error);
                }
            }
        }
        order.orderStatus = newStatus;
        yield order.save();
        return { status: true, data: order };
    }),
    review: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { orderId, rating, comment, userId } = data;
            const order = yield database_1.databaseSchema.Order.findById(orderId).populate('items.product');
            if (!order) {
                return { status: false, message: 'Order not found' };
            }
            order.reviewed = true;
            order.items.forEach((item) => __awaiter(void 0, void 0, void 0, function* () {
                const productId = item.product;
                const product = yield database_1.databaseSchema.Product.findById(productId._id);
                if (product) {
                    product.review.push({
                        user: userId,
                        orderId: orderId,
                        rating: rating,
                        reviewdescription: comment,
                    });
                    yield product.save();
                }
            }));
            yield order.save();
            return { status: true, data: order };
        }
        catch (err) {
            logger_1.default.error(err);
        }
    }),
    markMessagesAsRead: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { messageIds } = data;
            const conversation = yield database_1.databaseSchema.Conversation.findById(messageIds);
            if (!conversation) {
                logger_1.default.warn(`Conversation not found for message ID: ${messageIds}`);
                return { success: false, error: 'Conversation not found' };
            }
            const result = yield database_1.databaseSchema.RealTimeChat.updateMany({ conversationId: { $in: messageIds }, read: false }, { $set: { read: true } });
            console.log('conversation:', result);
            return { status: true, modifiedCount: result };
        }
        catch (error) {
            logger_1.default.error('Error marking messages as read:', error);
            return { success: false, error: 'Failed to mark messages as read' };
        }
    }),
    allListNumber: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let users, orders, products, creatives, posts;
            if (data === 'daily') {
                const tenDaysAgo = new Date();
                tenDaysAgo.setDate(tenDaysAgo.getDate() - 1);
                users = yield database_1.databaseSchema.User.countDocuments({ role: 'user', createdAt: { $gte: tenDaysAgo } });
                orders = yield database_1.databaseSchema.Order.countDocuments({ createdAt: { $gte: tenDaysAgo } });
                products = yield database_1.databaseSchema.Product.countDocuments({ createdAt: { $gte: tenDaysAgo } });
                creatives = yield database_1.databaseSchema.User.countDocuments({ role: 'creative', createdAt: { $gte: tenDaysAgo } });
                posts = yield database_1.databaseSchema.Post.countDocuments({ createdAt: { $gte: tenDaysAgo } });
            }
            else if (data === 'weekly') {
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - (7));
                users = yield database_1.databaseSchema.User.countDocuments({ role: 'user', createdAt: { $gte: oneWeekAgo } });
                orders = yield database_1.databaseSchema.Order.countDocuments({ createdAt: { $gte: oneWeekAgo } });
                products = yield database_1.databaseSchema.Product.countDocuments({ createdAt: { $gte: oneWeekAgo } });
                creatives = yield database_1.databaseSchema.User.countDocuments({ role: 'creative', createdAt: { $gte: oneWeekAgo } });
                posts = yield database_1.databaseSchema.Post.countDocuments({ createdAt: { $gte: oneWeekAgo } });
            }
            else if (data === 'monthly') {
                const oneMonthAgo = new Date();
                oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                users = yield database_1.databaseSchema.User.countDocuments({ role: 'user', createdAt: { $gte: oneMonthAgo } });
                orders = yield database_1.databaseSchema.Order.countDocuments({ createdAt: { $gte: oneMonthAgo } });
                products = yield database_1.databaseSchema.Product.countDocuments({ createdAt: { $gte: oneMonthAgo } });
                posts = yield database_1.databaseSchema.Post.countDocuments({ createdAt: { $gte: oneMonthAgo } });
                creatives = yield database_1.databaseSchema.User.countDocuments({ role: 'creative', createdAt: { $gte: oneMonthAgo } });
            }
            else {
                users = yield database_1.databaseSchema.User.countDocuments({ role: 'user' });
                orders = yield database_1.databaseSchema.Order.countDocuments();
                products = yield database_1.databaseSchema.Product.countDocuments();
                creatives = yield database_1.databaseSchema.User.countDocuments({ role: 'creative' });
                posts = yield database_1.databaseSchema.Post.countDocuments();
            }
            return { status: true, data: { users, orders, products, creatives, posts } };
        }
        catch (error) {
            logger_1.default.error('Error in allListNumber:', error);
            return { status: false, error: 'Failed to retrieve all list numbers' };
        }
    }),
    reviewEdit: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { productId, reviewId, reviewStar, reviewdescription } = data;
            const product = yield database_1.databaseSchema.Product.findById(productId)
                .populate('userId')
                .populate('collab');
            if ((product === null || product === void 0 ? void 0 : product.review) && (product === null || product === void 0 ? void 0 : product.review.length) > 0) {
                yield product.populate({
                    path: 'review.user',
                    select: 'name'
                });
            }
            if (product) {
                const review = product.review.find((r) => r._id.toString() === reviewId);
                if (review) {
                    review.rating = reviewStar;
                    review.reviewdescription = reviewdescription;
                    yield product.save();
                    return { status: true, data: product };
                }
                else {
                    return { status: false, message: 'Review not found' };
                }
            }
            else {
                return { status: false, message: 'Product not found' };
            }
        }
        catch (err) {
            logger_1.default.error(err);
            return { status: false, message: 'An error occurred' };
        }
    }),
    paymentStatus: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { orderId } = data;
            const order = yield database_1.databaseSchema.Order.findById(orderId);
            if (!order) {
                throw new Error('Order not found');
            }
            order.paymentStatus = 'Paid';
            yield order.save();
            return { status: true, data: order };
        }
        catch (error) {
            console.error('Error updating payment status:', error);
            return { status: false, error: error };
        }
    }),
    search: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let products = yield database_1.databaseSchema.Product.find({
                name: { $regex: data, $options: "i" }
            }).populate('userId').populate('collab');
            products = yield Promise.all(products.map((product) => __awaiter(void 0, void 0, void 0, function* () {
                if ((product === null || product === void 0 ? void 0 : product.review) && (product === null || product === void 0 ? void 0 : product.review.length) > 0) {
                    yield product.populate({
                        path: 'review.user',
                        select: 'name'
                    });
                }
                return product;
            })));
            return products;
        }
        catch (error) {
            console.error("Error in search:", error);
            throw error;
        }
    }),
};
