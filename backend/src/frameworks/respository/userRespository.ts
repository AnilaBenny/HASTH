import { databaseSchema } from "../database"; 

interface LikeOrDislikeData {
  postId: string;
  userId: string;
}

interface Post {
  _id: string;
  liked: string[];
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
  
      const response = await post.save();
  
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
  getPosts: async () => {
    try {
      const posts = await databaseSchema.Post.find()
    .sort({ createdAt: -1 })
    .populate('userId') 
    .populate({
        path: 'comments.userId', 
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
   
  }
  
  
  
};


