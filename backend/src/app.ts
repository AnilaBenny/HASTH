import http from 'http';
import express,{ Request, Response, NextFunction, response } from 'express';
import dotenv from 'dotenv';
import session, { MemoryStore } from 'express-session';
import serverConfig from './server';
import connectDB from './config/db.connect';
import config from './config/config';
import expressConfig from './express'; 
import dependencies from './frameworks/config/dependencies'
import { routes } from './adapters/router'; 
import passport from "passport";
import PassportConfig  from "../src/config/passport";
// import { middleware } from './utils/middleware/middleware';
import logger from './logger';
import { Server, Socket } from 'socket.io';
// import { createClient } from 'redis';
// import { createAdapter } from '@socket.io/redis-adapter';

const socketIORedis = require('socket.io-redis');
dotenv.config();

const app = express();
const server = http.createServer(app);
PassportConfig()
connectDB(config);
expressConfig(app);


const store = new MemoryStore();

app.use(session({
  store: store,
  secret: process.env.COOKIEPARSERSECRET || 'default_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true, 
    sameSite: 'none',
    maxAge: 24 * 60 * 60 * 1000,
  },
}));



app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    headers: req.headers,
    session: req.session
  });
  next();
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });
  res.status(500).send('Internal Server Error');
});



app.use(passport.initialize());
app.use(passport.session());
// app.use(middleware);

// webRTc
const io:Server=require('socket.io')(server,{
cors:{
  origin:['http://localhost:5173','https://www.hasthindia.shop']
}
});




// const pubClient = createClient({ url: 'redis://localhost:6379' });
// const subClient = pubClient.duplicate();

// Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
//   io.adapter(createAdapter(pubClient, subClient));
// });


let users:any=[]
const addUser = (receiverId: string,senderId:string,socketId:string,chatId:string) => {
  const existingUserIndex = users.findIndex((user:any) => user.chatId === chatId);

  if (existingUserIndex !== -1) {
    return
  } else {
      users.push({ receiverId,senderId,socketId,chatId });
  }
  console.log('.....',users,'chat');
  
};


const removeUser = (socketId: string) => {
  users = users.filter((user: any) => user.socketId !== socketId);
}


const getUser = (userId: string) => {
  console.log(users);
  
  return users.find((user: any) => user.userId === userId);
}
const getChatId=(senderId: string,receiverId:string) => {
   const chatId=users.filter((user: any) => {
    console.log(user);
    
    return user.senderId === senderId&&user.receiverId === receiverId
  });
   console.log(chatId,'adgyqwteuqwfyqw');
   
   return chatId
}



io.on("connection",(socket:Socket)=>{
  console.log('User connected to socket:', socket.id);

  socket.on('joinChat', (data: any) => {
    const { chatId,receiverId,senderId } = data;

    const existingUser = getChatId(senderId,receiverId);
    
    if (existingUser) {
        existingUser.socketId = socket.id;
    } else {
        addUser(receiverId,senderId,socket.id,chatId);
    }
    socket.join(chatId);
    

});

  socket.on('sendMessage',async({senderId,receiverId,content,conversationId,type,timestamp},callback)=>{
    const {sendMessegesUseCase}=dependencies.useCase;
    const data={
      content,
      receiverId,
      senderId,
      type,
      conversationId,
      timestamp, 
    };

    const response=await sendMessegesUseCase(dependencies).executeFunction(data);
  
    if(response && response.status&&response.data){
    const chatId=getChatId(response.data.receiverId,response.data.senderId)
    console.log('sdhjsahgd',chatId,'ajsghjagjhadhj');
    
      
      if (chatId) {
        io.to(chatId).emit('getMessage', response.data);
      }
    }
      if (callback) {
        callback({ success: true, data:response.data });
      }
      
    

  });

  socket.on('sendImage',async({senderId,receiverId,content,conversationId,type,timestamp},callback)=>{
    const {sendImageUseCase}=dependencies.useCase;
    const data={
      senderId,receiverId,content,conversationId,type,timestamp
    };
    const response=await sendImageUseCase(dependencies).executeFunction(data);
    if(response && response.status && response.data){
      const chatId=getChatId(response.data.receiverId,response.data.senderId)
        
        if (chatId) {
    
          
          io.to(chatId).emit('getMessage', response.data);
        }
      }
      if (callback) {
        callback({ success: true, data:response.data });
      }
  });
  socket.on('audioStream',async({senderId,receiverId,content,conversationId,type,timestamp},callback)=>{
    const { sendAudioUseCase } = dependencies.useCase;
    const data = {
      content,
      receiverId,
      senderId,
      type,
      conversationId,
      timestamp, 
    };

    const response = await sendAudioUseCase(dependencies).executeFunction(data);
    if(response && response.status && response.data){
      const chatId = getChatId(receiverId,senderId);      
        io.to(chatId).emit('getMessage', data);
    
      }
      if (callback) {
        callback({ success: true, data:response.data });
      }
 
    
  });
  socket.on('videoCall', async (data, callback) => {
    try {
      const { creativeId, userId, roomId, userName, creativeName } = data;
  
      const sender = await getUser(userId);
      const recipient = await getUser(creativeId);
      console.log(sender,recipient,'videocall');
      
      if (recipient && sender) {
        io.to(recipient.socketId).emit('incomingCall', { 
          roomId, 
          caller: userName 
        });
  
  
        if (callback) callback({ success: true });
      } else {
        if (callback) callback({ success: false, message: 'User or recipient not found' });
      }
    } catch (error) {
      console.error('Error handling video call:', error);
      if (callback) callback({ success: false, message: 'Internal server error' });
    }
  });
  
  
  socket.on('rejectCall', ({ roomId, rejectedBy }) => {
    const caller = users.find((user:any) => user.userId !== rejectedBy);
    if (caller) {
      io.to(caller.socketId).emit('callRejected', { roomId, rejectedBy });
    }
  });
  
  

socket.on('disconnect', (chatId) => {
    users = users.filter((user:any) => user.socketId !== socket.id);
    removeUser(socket.id);
    socket.leave(chatId);
    io.emit('userList', users);
  });

socket.on('error', (error: any) => {
    console.error(`Socket error for client ${socket.id}:`, error);
  });
})

app.use('/api', routes(dependencies))


serverConfig(server, config).startServer();
