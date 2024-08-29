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
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import { log } from 'console';
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
}));


app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    headers: req.headers,
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
  origin:['http://localhost:5173']
}
});



// const pubClient = createClient({ url: 'redis://localhost:6379' });
// const subClient = pubClient.duplicate();

// Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
//   io.adapter(createAdapter(pubClient, subClient));
// });


let users:any=[]
const addUser = (userId: string, socketId: string) => {
  if (!users.some((user: any) => user.userId === userId)) {
    users.push({ userId, socketId });
  }
}


const removeUser = (socketId: string) => {
  users = users.filter((user: any) => user.socketId !== socketId);
}


const getUser = (userId: string) => {
  console.log(users);
  
  return users.find((user: any) => user.userId === userId);
}




io.on("connection",(socket:Socket)=>{
  console.log('User connected to socket:', socket.id);

  socket.on('joinChat', (data: any) => {
    console.log(data, 'inside....join...chat');
    const { chatId, id } = data;

    addUser(id, socket.id);
    io.emit('userList', users);
    console.log('Emitting user list:', users);
    io.to(chatId).emit('message', `User ${id} has joined the chat.`);
  });

  socket.on('sendMessage',async({senderId,recieverId,content,conversationId,type,timestamp},callback)=>{
    const {sendMessegesUseCase}=dependencies.useCase;
    const data={
      content,
      recieverId,
      senderId,
      type,
      conversationId,
      timestamp, 
    };
    console.log('....user',data);
    
    const response=await sendMessegesUseCase(dependencies).executeFunction(data);
    console.log(response,'.....insend message');
    
    if(response && response.status&&response.data){
      const recipient = getUser(recieverId);
      const sender = getUser(senderId);
      console.log(recipient,sender);
      

      if (recipient && sender) {
        io.to(recipient.socketId).to(sender.socketId).emit('getMessage', data);
      } else if (recipient) {
        io.to(recipient.socketId).emit('getMessage', data);
      } else if (sender) {
        io.to(sender.socketId).emit('getMessage', data);
      }
      }
      if (callback) {
        callback({ success: true, data:response.data });
      }
      
    

  });

  socket.on('sendImage',async({senderId,recieverId,content,conversationId,type,timestamp},callback)=>{
    const {sendImageUseCase}=dependencies.useCase;
    const data={
      senderId,recieverId,content,conversationId,type,timestamp
    };
    const response=await sendImageUseCase(dependencies).executeFunction(data);
    if(response && response.status && response.data){
      const recipient = getUser(recieverId);
      const sender = getUser(senderId);
      console.log(recipient,sender);
      

      if (recipient && sender) {
        io.to(recipient.socketId).to(sender.socketId).emit('getMessage', data);
      } else if (recipient) {
        io.to(recipient.socketId).emit('getMessage', data);
      } else if (sender) {
        io.to(sender.socketId).emit('getMessage', data);
      }
      }
      if (callback) {
        callback({ success: true, data:response.data });
      }
  });
  socket.on('audioStream',async({senderId,recieverId,content,conversationId,type,timestamp},callback)=>{
    const { sendAudioUseCase } = dependencies.useCase;
    const data = {
      content,
      recieverId,
      senderId,
      type,
      conversationId,
      timestamp, 
    };

    const response = await sendAudioUseCase(dependencies).executeFunction(data);
    if(response && response.status && response.data){
      const recipient = getUser(recieverId);
      const sender = getUser(senderId);
      console.log(recipient,sender);
      

      if (recipient && sender) {
        io.to(recipient.socketId).to(sender.socketId).emit('getMessage', data);
      } else if (recipient) {
        io.to(recipient.socketId).emit('getMessage', data);
      } else if (sender) {
        io.to(sender.socketId).emit('getMessage', data);
      }
      }
      if (callback) {
        callback({ success: true, data:response.data });
      }
 
    
  })

socket.on('disconnect', () => {
    users = users.filter((user:any) => user.socketId !== socket.id);
    removeUser(socket.id);
    io.emit('userList', users);
  });

socket.on('error', (error: any) => {
    console.error(`Socket error for client ${socket.id}:`, error);
  });
})

app.use('/api', routes(dependencies))


serverConfig(server, config).startServer();
