import { log } from "console";
import logger from "../../logger";
import { databaseSchema } from "../database";


interface LikeOrDislikeData {
  postId: string;
  userId: string;
}

interface Comment {
  _id: string;
  userId: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  replies: Reply[];
  isPinned: boolean;
}

interface Reply {
  userId: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}
interface Post  {
  _id: string;
  liked: string[];
  comments: Comment[];
  save: () => Promise<void>;
}

interface ReportData {
  reportedUserId?: string;
  reportedPostId?: string; 
  reportedCommentId?: string; 
  type: 'post' | 'comment' | 'user';
  reason: string;
}


export default  {
  createUser: async (data: any) => {
    try {
      console.log(data);
      
      const {
        name,
        email,
        password,
        mobile,
        skills,
        education,
        specification,
        street,
        city,
        state,
        zipCode,
        role,
        image
      } = data;
      let user;
      if(role==='user'){
         user = new databaseSchema.User({
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
         
          isVerified:true
        });
      }else{
         user = new databaseSchema.User({
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
          isVerified:false
        });
      }
     

      const response = await user.save();
      if (response) {
        
        return { status: true, data: response };
      } else {
        return { status: false, message: "User creation failed" }; 
      }
    } catch (error) {
      console.error("Error in userService.createUser:", error);
      return { status: false, message: "Internal server error" }; 
    }
  },
  getUserByEmail: async (data: any) => {
    try {
      const { email } = data;
      const user = await databaseSchema.User.findOne({ email });
      if (user) {
        return { status: true, data: user };
      } else {
        return { status: false, message: "User not found" };
      }
    } catch (error) {
      console.error("Error in userService.getUserByEmail:", error);
      throw new Error("Internal server error"); 
    }
  },
  finduser: async (email: any) => {
    try {
     

      const finduser = await databaseSchema.User.findOne({
        email: email,
      });
      ;
      if (finduser) {
        return { status: true, user: finduser };
      } else {
        return { status: false,message:'user not found'};
      }
    } catch (error) {
      console.log(
        "error in repositery authencation repo in userEmailexist",
        error
      );
    }
  },
  forgotPassword:async(email:any)=>{
    
    
    try{
      const finduser = await databaseSchema.User.findOne({
        email: email,
      });
      console.log(finduser,email);
      
      if (finduser) {
        return { status: true, data: finduser };
      } else {
        return { status: false, message: "User not found" };
      }

    }catch (error) {
      console.error("Error in userRespository.forgotPassword:", error);
      throw new Error("Internal server error"); 
    }
  },
  updatePassword:async(data:any)=>{
    try{
      const {email,password}=data
      const updateUser = await databaseSchema.User.findOneAndUpdate({
        email: email,
      },{password:password});
      if(updateUser){
        return { status: true, message:'Password updated' };
      } else {
        return { status: false, message: "User not found" };
      }

    }catch(error){
      console.error('Error in userRespository.updatePassword',error);
      throw new Error('Internal server error')
    }
  },
  updateProfile:async(data:any)=>{
    try {
      const {
        name,
        email,
        mobile,
        skills,
        education,
        specification,
        street,
        city,
        state,
        zipCode,
        role,
        image,
      } = data;
      const address = { street, city, state, zipCode };
      const user = await databaseSchema.User.findOneAndUpdate(
        { email: email }, 
        {
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
        },
        { new: true } 
      );
   
      if (user) {
        return { status: true, data: user };
      } else {
        return { status: false, message: "Profile updation failed" }; 
      }
    } catch (error) {
      console.error("Error in userRespository.updateProfile:", error);
      return { status: false, message: "Internal server error" }; 
    }
  },
  createPost:async (data: any) => {
    console.log(data);
    
    const { userId, caption, images, video,tag} = data;
    try {
  
      const post = new databaseSchema.Post({
        userId,
        caption,
        images,
        video,
        tags:tag
      });
  
       await post.save();
       const response =await databaseSchema.Post.find().sort({ createdAt: -1 })
  
      if (response) {
        return { status: true, data: response };
      } else {
        return { status: false, message: "Post creation failed" };
      }
    } catch (error) {
      console.error("Error during post creation:", error);
      return { status: false, message: "An error occurred during post creation" };
    }
  },
  getPosts: async (page:any) => {
    try {
      const limit=6
      const skip = (page - 1) * limit;
      const posts = await databaseSchema.Post.find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate('userId')
          .populate({
              path: 'comments.userId',
          }).populate({
            path: 'comments.replies.userId',
            
          });

      return {status:true,data:posts};
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw new Error('Unable to fetch posts');
    }
  },
  likeOrDislikePost: async (data: LikeOrDislikeData): Promise<{ status: boolean; message: string }> => {
    try {
      const { postId, userId } = data;
  
      const post:Post|null = await databaseSchema.Post.findById(postId);
  
      if (!post) {
        throw new Error('Post not found');
      }
  
      const userIndex = post.liked.indexOf(userId);
  
      if (userIndex > -1) {
        post.liked.splice(userIndex, 1);
      } else {
        post.liked.push(userId);
      }
  
      await post.save();
  
      return {
        status: true,
        message: userIndex > -1 ? 'Disliked' : 'Liked',
      };
    } catch (error) {
      console.error('Error liking or disliking post:', error);
      return {
        status: false,
        message: 'Error processing your request',
      };
    }
  },
  createComment:async(data:any)=>{
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

      const updatedPost = await databaseSchema.Post.findByIdAndUpdate(
          postId,
          { $push: { comments: newComment }, $set: { updatedAt: new Date() } }, 
          { new: true, useFindAndModify: false }
      ).populate('userId') 
      .populate({
          path: 'comments.userId', 
      });

      if (!updatedPost) {
          throw new Error('Post not found');
      }

      console.log('Comment added successfully');
      return {status:true,data:updatedPost}; 
  } catch (error) {
      console.error('Error creating comment:',error);
      return {status:false,message:'Error creating comment'};

  }
  },
  createCommentReply:async(data:any)=>{
    try{
    const { userId, commentId, postId, text } = data;

    if (!userId || !commentId || !postId || !text) {
      throw new Error('User ID, Comment ID, Post ID, and text are required');
    }

    const updatedPost = await databaseSchema.Post.findById(postId)
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
  const post=updatedPost as any;
    const comment = post?.comments.find((c: Comment) => c._id.toString() === commentId);

    if (!comment) {
      throw new Error('Comment not found');
    }

    comment.replies.push({
      userId,
      text,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    

    await updatedPost.save();

    console.log('Reply added successfully');
    return { status: true, data: updatedPost};
  } catch (error) {
    logger.error('Error creating comment reply:', error);
    return { status: false, message: 'Error creating comment reply' };
  }
  },
  createReport:async (data: ReportData) =>{
    try {
      let newReport;
      data.type==='post'?
       newReport = new databaseSchema.Report({
        reportedUserId: data.reportedUserId,
        reportedPostId: data.reportedPostId,
        reportedCommentId: data.reportedCommentId,
        type: data.type,
        reason: data.reason,
      }): newReport = new databaseSchema.Report({
        reportedUserId: data.reportedPostId,
        
        reportedCommentId: data.reportedCommentId,
        type: data.type,
        reason: data.reason,
      })
  
      
      const savedReport = await newReport.save(); 
  
      return { status: true, data: savedReport };
    } catch (error) {
      console.error('Error creating report:', error);
      return { status: false, message: 'An error occurred during report creation' };
    }
  },
  createProduct:async(data:any)=>{
    const { userId,collab,name, description, images,brand,countInStock,price} = data;
    try {
  
      const product = new databaseSchema.Product({
        userId,collab,name, description, images,countInStock,price
      });
  
      const response = await product.save();
  
      if (response) {
        return { status: true, data: response };
      } else {
        return { status: false, message: "Post creation failed" };
      }
    } catch (error) {
      console.error("Error during post creation:", error);
      return { status: false, message: "An error occurred during post creation" };
    }
  },
  getCreators:async()=>{
    try {
      const creators = await databaseSchema.User.find({ role: 'creative' });
      
    
      if (creators && creators.length > 0) {
        return { status: true, data: creators };
      }
    
      return { status: false, data: [] };
    } catch (error) {
      console.error('Error fetching creators:', error);
      throw new Error('Unable to fetch creators');
    }
    
  },
  getProducts:async(data:any)=>{
    try {
      const products = await databaseSchema.Product.find()
    .sort({ createdAt: -1 })
      return {status:true,data:products};
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Unable to fetch products');
    }
  },
  editPost: async (data: any) => {
    try {
      console.log(data);
      
      const { postId, caption, images, video, tags } = data;
  
      const existingPost = await databaseSchema.Post.findById(postId);
      
      if (!existingPost) {
        return { status: false, message: 'Post not found' };
      }
  
     
      existingPost.caption = caption || existingPost.caption;
      existingPost.images = images.length > 0 ? images : existingPost.images;
      existingPost.video = video || existingPost.video;
      existingPost.tags = tags || existingPost.tags;
  
 
      const updatedPost = await existingPost.save();
  
      return { status: true, data: updatedPost };
    } catch (error) {
      console.error('Error editing post:', error);
      return { status: false, message: 'Error editing post' };
    }
  },
  editProduct :async (data: any) => {
    try {
      console.log(data);
      
      const { productId,_id,name, description, collab, images, brand, countInStock, isFeatured, price, popularity, list } = data;
  
      
      const existingProduct = await databaseSchema.Product.findById(_id);
      if (!existingProduct) {
        return { status: false, message: 'Product not found' };
      }
  
      existingProduct.name = name ?? existingProduct.name;
      existingProduct.description = description?? existingProduct.description;
      existingProduct.collab = collab ?? existingProduct.collab;
      existingProduct.images = images && images.length > 0 ? images : existingProduct.images;
      existingProduct.brand = brand ?? existingProduct.brand;
      existingProduct.countInStock = countInStock !== undefined ? countInStock : existingProduct.countInStock;
      existingProduct.isFeatured = isFeatured !== undefined ? isFeatured : existingProduct.isFeatured;
      existingProduct.price = price !== undefined ? price : existingProduct.price;
      existingProduct.popularity = popularity !== undefined ? popularity : existingProduct.popularity;
      existingProduct.list = list !== undefined ? list : existingProduct.list;
  
      const updatedProduct = await existingProduct.save();
  
      return { status: true, data: updatedProduct };
    } catch (error) {
      console.error('Error editing product:', error);
      return { status: false, message: 'Error editing product' };
    }
  },
  deletePost:async (postId: any) => {
    try {
     
       await databaseSchema.Post.findByIdAndDelete(postId);
      return { status: true, message: 'Post deleted successfully' };
    } catch (error) {
      console.error('Error deleting post:', error);
      return { status: false, message: 'Error deleting post' };
    }
  },
  activeordeactiveProduct:async(productId:any)=>{
    try {
      const product = await databaseSchema.Product.findById(productId);
      console.log(productId,product);
      

      if (!product) {
        return { status: false, message: 'Product not found' };
      }
  
      product.list = !product.list;
  
      const updatedProduct = await product.save();
  
      return {
        status: true,
        data: updatedProduct,
      };
    } catch (error) {
      console.error('Error updating product status:', error);
      return { status: false, message: 'Error updating product status' };
    }
   
  },
  pinunpinComment:async(data:any)=>{
    try {
      const { userId, commentId, postId } = data;
  
      if (!userId || !commentId || !postId) {
        throw new Error('User ID, Comment ID, and Post ID are required');
      }
  
      const updatedPost= await databaseSchema.Post.findById(postId)
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
      const post:any=updatedPost.comments
      const comment = post.find((c: Comment) => c._id.toString() === commentId);
  
      if (!comment) {
        throw new Error('Comment not found');
      }
  
      comment.isPinned = !comment.isPinned;
      await updatedPost.save();
  
      return {
        status: true,
        message: `Comment ${comment.isPinned ? 'pinned' : 'unpinned'} successfully`,
        post,
      };
    } catch (error) {
      logger.error('Error in pinunpinComment:', error);
      return {
        status: false,
        message: error,
      };
    }
  },
  addtocart:async(data:any)=>{
    try {
      const { productId, userId } = data;
      const product = await databaseSchema.Product.findById(productId);
  
      if (!product) {
          return { status: false, message: 'Product not found' };
      }
  
      if (product.countInStock === 0) {
          return { status: false, message: 'OUT_OF_STOCK' };
      }
  
      let cart = await databaseSchema.Cart.findOne({ userId }).populate('items.productId');
  
      if (cart) {
          const existingItemIndex = cart.items.findIndex(
              (item) => item.productId._id.toString() === productId.toString()
          );
  
          if (existingItemIndex !== -1) {
              if (cart.items[existingItemIndex].quantity >= 5) {
                  return { status: false, message: 'PRODUCT_LIMIT_EXCEEDED' };
              }
              cart.items[existingItemIndex].quantity += 1;
              cart.items[existingItemIndex].price = product.price;
          } else {
              cart.items.push({
                  productId: product._id,
                  quantity: 1,
                  price: product.price
              });
          }
      } else {
          cart = new databaseSchema.Cart({
              userId,
              items: [{
                  productId: product._id,
                  quantity: 1,
                  price: product.price
              }]
          });
      }
  
      await cart.save();
      const populatedCart = await databaseSchema.Cart.findById(cart._id)
      .populate('items.productId');
      return { status: true, data: populatedCart };
  } catch (error) {
      console.error('Error adding to cart:', error);
      return { status: false, message: 'Error adding to cart' };
  }
  
  },
  deleteCartItem:async(data:any)=>{
      const { userId, itemId } = data;
      const cart = await databaseSchema.Cart.findOne({ userId });
      if (!cart) {
        return { status: false, message: 'Cart not found' };
      }

      const itemIndex = cart.items.findIndex(item => item && item._id?.toString() === itemId);
    
      if (itemIndex !== -1) {
     
        cart.items.splice(itemIndex, 1);
        await cart.save();
        return { status: true, message: 'Item deleted' };
      } else {
        return { status: false, message: 'Item not found in cart' };
      }
    },
  order:async(data:any)=>{
    try {
      const { cart, paymentMethod, shippingAddress } = data;
  
  
      if (!cart || !cart.userId) {
        throw new Error('Invalid cart or user ID');
      }
  
      
      const orderItems = cart.items.map((item: any) => ({
        product: item.productId,
        quantity: item.quantity,
        price: item.price,
      }));
  
     
      const user = await databaseSchema.User.findById(cart.userId);
      if (!user) {
        throw new Error('User not found');
      }

  
     
      const newOrder = new databaseSchema.Order({
        userId: user._id,
        orderId:'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        items: orderItems,
        totalAmount: cart.totalPrice,
        shippingAddress: user.address[0],
        paymentMethod: paymentMethod,
        paymentStatus: 'Paid',
        orderStatus: 'Processing',
      });
  
      
      const savedOrder = await newOrder.save();
  
      await databaseSchema.Cart.findByIdAndUpdate(
        cart._id,
        { items: [], totalPrice: 0 }
      );
        if(savedOrder){
          return { status: true, data: savedOrder };
        }else{
          return { status: false };
        }
      
    } catch (error) {
      logger.error(error);
      return { status: false, error: error }; 
    }
    },
  allorderbyuser:async(userId:any)=>{
    const orders=await databaseSchema.Order.find({userId:userId}).populate('items.product')
    return {status:true,data:orders}
    },
  sendMesseges:async(data:any)=>{
      try {
        const { content,
          recieverId,
          senderId,
          type,
          conversationId
        } = data
  
        const message = new databaseSchema.RealTimeChat({
          conversationId: conversationId,
          content: content,
          senderId: senderId,
          receiverId: recieverId,
          type: type,
        })
        const responce = await message.save()
        if (responce) {
          return { status: true, data: data }
        } else {
          return { status: true, message: "Message failed..!" }
        }
  
      } catch (error) {
        console.log(error);
        return { status: true, message: `something went wrong failed ${error}` }
      }
    },
  sendImage:async(data:any)=>{
    try {
      const { content,
        recieverId,
        senderId,
        type,
        conversationId
      } = data

      const message = new databaseSchema.RealTimeChat({
        conversationId: conversationId,
        content: content,
        senderId: senderId,
        receiverId: recieverId,
        type: type,
      })
      const responce = await message.save()
      if (responce) {
        return { status: true, data: data }
      } else {
        return { status: true, message: "Message failed..!" }
      }

    } catch (error) {
      console.log(error);
      return { status: true, message: `something went wrong failed ${error}` }
    }
  },
  sendAudio:async(data:any)=>{
    try {
      const { content,
        recieverId,
        senderId,
        type,
        conversationId
      } = data

      const message = new databaseSchema.RealTimeChat({
        conversationId: conversationId,
        content: content,
        senderId: senderId,
        receiverId: recieverId,
        type: type,
      })
      const responce = await message.save()
      if (responce) {
        return { status: true, data: data }
      } else {
        return { status: true, message: "Message failed..!" }
      }

    } catch (error) {
      console.log(error);
      return { status: true, message: `something went wrong failed ${error}` }
    }
  },
  getConversation: async (data: any) => {
      try {
        const { id, role } = data;
        let conversations: any;
    
      
        if (role === 'user') {
          conversations = await databaseSchema.Conversation.find({ "members.userId": id });
          const creativeConversations: any = [];
    
          for (let i = 0; i < conversations.length; i++) {
            const conversation = conversations[i];
            const memberIds = conversation.members.map((member: any) => member.creativeId);
      
           
            const receiverId = memberIds.find((memberId: string) => memberId !== id);
      
            const creative = await databaseSchema.User.findById(receiverId);
      
            const creativeConversation = {
              creative: creative,
              conversation: conversation,
            };
      
            creativeConversations.push(creativeConversation);
          }
      
          if (creativeConversations.length > 0) {
            return { status: true, data: creativeConversations };
          } else {
            return { status: true, data: [] };
          }
        } else {
          conversations = await databaseSchema.Conversation.find({ "members.creativeId": id });
          const userConversations: any = [];
      for (let i = 0; i < conversations.length; i++) {

        const userId = conversations[i].members[0].userId;


        const user: any = await databaseSchema.User.findById(userId);
        console.log(userId,"THIS IS USER ",i);
        
        if(user){
          const userConversation = {
            user: user,
            conversation: conversations[i]
          };
          userConversations.push(userConversation);
        }
       
      }

      if (userConversations.length > 0) {

        return { status: true, data: userConversations }

      }

      else {
        return { status: true, data: [] }
      }
        }
    
     
      } catch (error) {
        console.error("An error occurred while fetching conversations:", error);
        return { status: false, message: "An error occurred while fetching conversations" };
      }
    },
  createConversation: async (data: any) => {
      try {
        const { senderId, recieverId } = data;
   
  
  
   
        const existingConversation = await databaseSchema.Conversation.findOne({
          members: {
            $elemMatch: {
              creativeId: recieverId,
              userId: senderId
            }
          }
        });
  
        if (existingConversation) {
          return { status: true, data: existingConversation };
        } else {

          const conversation = new databaseSchema.Conversation({
            members: [
              {
                creativeId: recieverId,
                userId: senderId
              }
            ]
          });
  
          const response = await conversation.save();
  
        
  
          if (response) {
            return { status: true, data: response };
  
          } else {
            return { status: false, message: "No conversation created..!" };
          }
        }
      } catch (error) {
        return { status: false, message: `Something went wrong: ${error}` };
      }
    },
  getConverstationById: async (data: any) => {
      try {
        const { id } = data
        const response = await databaseSchema.RealTimeChat.find({ converstationId: id })
  
        if (response) {
          return { status: true, data: response }
        } else {
          return { status: false, message: "Messages not found ..!" }
        }
      } catch (error) {
        console.log(error);
        return { status: false, message: `Messages not found ..!${error}` }
      }
    },
  cancelOrder:async(data:any)=>{
    const { OrderId} = data;
    const order = await databaseSchema.Order.findById(OrderId).populate('items.product');

    if (!order) {
      return { status: false, message: 'order not found' };
    }
    order.items.forEach((item) => {
      const product = item.product as any; 
      if (product) {
        product.countInStock += item.quantity;
      }
    });
    order.orderStatus='Cancelled'
      await order.save();
      return { status: true, data:order };
  
    },
  updateOrderStatus:async(data:any)=>{
    const { OrderId, newStatus } = data;
    const order = await databaseSchema.Order.findById(OrderId).populate('items.product');
    if (!order) {
      return { status: false, message: 'Order not found' };
    }
    if(newStatus==='Cancelled'){
      order.items.forEach((item) => {
        const product = item.product as any;
        if (product) {
          product.countInStock += item.quantity;
        }
      }); 
    }
    order.orderStatus=newStatus
      await order.save();
      return { status: true, data:order };
    },
    review:async(data:any)=>{
      try{
      const {
        orderId,
        rating,
        comment,
        userId } = data;
      const order = await databaseSchema.Order.findById(orderId).populate('items.product');
      if (!order) {
        return { status: false, message: 'Order not found' };
      }
 
      order.items.forEach(async (item) => {
        const productId = item.product as any;
        const product = await databaseSchema.Product.findById(productId._id);
      
        if (product) {
          product.review.push({
            user: userId,
            rating: rating,
            reviewdescription: comment,
          });
      
          await product.save();
        }
      });
      

        await order.save();
        return { status: true, data:order };
    }
  catch(err){
    logger.error(err)
  }
  }
    
    

};


