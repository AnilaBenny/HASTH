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
          address: [{ street, city, state, zipCode: zipCode }], 
          role,
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
          specification,
          address: [{ street, city, state, zipCode: zipCode }], 
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
  }
  
};


