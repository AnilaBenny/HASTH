import http from 'http';
import express,{ Request, Response, NextFunction } from 'express';
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
import redis from 'redis';
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
// app.use((req, res, next) => {
//   console.log('Session ID:', req.sessionID);
//   console.log('Session Data:', req.session);
//   next();
// });

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

//webRTc
const io:Server=require('socket.io')(server,{
cors:{
  origin:['http://localhost:5173']
}
});


const pubClient = redis.createClient();
const subClient = redis.createClient();

io.adapter(socketIORedis({ pubClient, subClient }));


let users:any=[]
const addUser=(userId:any,socketId:any)=>{
  !users.some((user:any)=>user.userId===userId)&&
  users.push({userId,socketId})
}

const removeUser=(socketId:any)=>{
  users.filter((user:any)=>user.socketId !==socketId)
}

const getUser=(userId:any)=>{
  return users.find((user:any)=>userId.id===userId)
}

io.on("connection",(socket:Socket)=>{
  console.log('connected', socket.id);

  socket.on('joinChat',()=>{
    const {chatId,id}=data;
    const existingUserIndex=users.findIndex((user:any)=>user.id===id);
    if(existingUserIndex===-1){
      users.push({id,socketId:socket.id})
    }else{
      users[existingUserIndex].socketId=socket.id;
    }
    console.log(users,'users in socket connection');
  });

  socket.on('sendMessage',async({senderId,recieverId,content,converstationId,type,timestamp})=>{
    const {sendMessagesUseCase}=dependencies.useCase;
    const data={
      content,
      recieverId,
      senderId,
      type,
      converstationId,
      timestamp, 
    };
    const response=await sendMessagesUseCase(dependencies).executeFunction(data);
    if(response && response.status&&response.data){
      const recipient=users.find((user:any)=>user.id===recieverId);
      const sender=users.find((user:any)=>user.id===senderId)
      if(recipient){
        io.to(recipient.socketId).to(sender?.socketId).emit('getMessage',{senderId,content,converstationId,recieverId,timestamp});

      }else{
        io.to(sender?.socketId).emit('getMessage', { senderId, content, converstationId, recieverId, type ,timestamp});
      }
    }

  })

socket.on('disconnect', () => {
    users = users.filter((user:any) => user.socketId !== socket.id);
    removeUser(socket.id);
  });

socket.on('error', (error: any) => {
    console.error(`Socket error for client ${socket.id}:`, error);
  });
})

app.use('/api', routes(dependencies))


serverConfig(server, config).startServer();
