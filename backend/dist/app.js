"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_session_1 = __importStar(require("express-session"));
const server_1 = __importDefault(require("./server"));
const db_connect_1 = __importDefault(require("./config/db.connect"));
const config_1 = __importDefault(require("./config/config"));
const express_2 = __importDefault(require("./express"));
const dependencies_1 = __importDefault(require("./frameworks/config/dependencies"));
const router_1 = require("./adapters/router");
const passport_1 = __importDefault(require("passport"));
const passport_2 = __importDefault(require("../src/config/passport"));
// import { middleware } from './utils/middleware/middleware';
const logger_1 = __importDefault(require("./logger"));
// import { createClient } from 'redis';
// import { createAdapter } from '@socket.io/redis-adapter';
const socketIORedis = require('socket.io-redis');
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
(0, passport_2.default)();
(0, db_connect_1.default)(config_1.default);
(0, express_2.default)(app);
const store = new express_session_1.MemoryStore();
app.use((0, express_session_1.default)({
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
app.use((req, res, next) => {
    logger_1.default.info(`${req.method} ${req.url}`, {
        ip: req.ip,
        headers: req.headers,
        session: req.session
    });
    next();
});
app.use((err, req, res, next) => {
    logger_1.default.error('Unhandled error', {
        error: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
    });
    res.status(500).send('Internal Server Error');
});
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// app.use(middleware);
// webRTc
const io = require('socket.io')(server, {
    cors: {
        origin: ['http://localhost:5173', 'https://www.hasthindia.shop']
    }
});
// const pubClient = createClient({ url: 'redis://localhost:6379' });
// const subClient = pubClient.duplicate();
// Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
//   io.adapter(createAdapter(pubClient, subClient));
// });
let users = [];
const addUser = (receiverId, senderId, socketId, chatId) => {
    const existingUserIndex = users.findIndex((user) => user.chatId === chatId);
    if (existingUserIndex !== -1) {
        return;
    }
    else {
        users.push({ receiverId, senderId, socketId, chatId });
    }
    console.log('.....', users, 'chat');
};
const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};
const getUser = (userId) => {
    console.log(users);
    return users.find((user) => user.userId === userId);
};
const getChatId = (senderId, receiverId) => {
    const chatId = users.filter((user) => {
        console.log(user);
        return user.senderId === senderId && user.receiverId === receiverId;
    });
    console.log(chatId, 'adgyqwteuqwfyqw');
    return chatId;
};
io.on("connection", (socket) => {
    console.log('User connected to socket:', socket.id);
    socket.on('joinChat', (data) => {
        const { chatId, receiverId, senderId } = data;
        const existingUser = getChatId(senderId, receiverId);
        if (existingUser) {
            existingUser.socketId = socket.id;
        }
        else {
            addUser(receiverId, senderId, socket.id, chatId);
        }
        socket.join(chatId);
    });
    socket.on('sendMessage', (_a, callback_1) => __awaiter(void 0, [_a, callback_1], void 0, function* ({ senderId, receiverId, content, conversationId, type, timestamp }, callback) {
        const { sendMessegesUseCase } = dependencies_1.default.useCase;
        const data = {
            content,
            receiverId,
            senderId,
            type,
            conversationId,
            timestamp,
        };
        const response = yield sendMessegesUseCase(dependencies_1.default).executeFunction(data);
        if (response && response.status && response.data) {
            const chatId = getChatId(response.data.receiverId, response.data.senderId);
            console.log('sdhjsahgd', chatId, 'ajsghjagjhadhj');
            if (chatId) {
                io.to(chatId).emit('getMessage', response.data);
            }
        }
        if (callback) {
            callback({ success: true, data: response.data });
        }
    }));
    socket.on('sendImage', (_a, callback_1) => __awaiter(void 0, [_a, callback_1], void 0, function* ({ senderId, receiverId, content, conversationId, type, timestamp }, callback) {
        const { sendImageUseCase } = dependencies_1.default.useCase;
        const data = {
            senderId, receiverId, content, conversationId, type, timestamp
        };
        const response = yield sendImageUseCase(dependencies_1.default).executeFunction(data);
        if (response && response.status && response.data) {
            const chatId = getChatId(response.data.receiverId, response.data.senderId);
            if (chatId) {
                io.to(chatId).emit('getMessage', response.data);
            }
        }
        if (callback) {
            callback({ success: true, data: response.data });
        }
    }));
    socket.on('audioStream', (_a, callback_1) => __awaiter(void 0, [_a, callback_1], void 0, function* ({ senderId, receiverId, content, conversationId, type, timestamp }, callback) {
        const { sendAudioUseCase } = dependencies_1.default.useCase;
        const data = {
            content,
            receiverId,
            senderId,
            type,
            conversationId,
            timestamp,
        };
        const response = yield sendAudioUseCase(dependencies_1.default).executeFunction(data);
        if (response && response.status && response.data) {
            const chatId = getChatId(receiverId, senderId);
            io.to(chatId).emit('getMessage', data);
        }
        if (callback) {
            callback({ success: true, data: response.data });
        }
    }));
    socket.on('videoCall', (data, callback) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { creativeId, userId, roomId, userName, creativeName } = data;
            const sender = yield getUser(userId);
            const recipient = yield getUser(creativeId);
            console.log(sender, recipient, 'videocall');
            io.to(recipient.socketId).emit('incomingCall', {
                roomId,
                caller: userName
            });
            if (callback)
                callback({ success: true });
        }
        catch (error) {
            console.error('Error handling video call:', error);
            if (callback)
                callback({ success: false, message: 'Internal server error' });
        }
    }));
    socket.on('rejectCall', ({ roomId, rejectedBy }) => {
        const caller = users.find((user) => user.userId !== rejectedBy);
        if (caller) {
            io.to(caller.socketId).emit('callRejected', { roomId, rejectedBy });
        }
    });
    socket.on('disconnect', (chatId) => {
        users = users.filter((user) => user.socketId !== socket.id);
        removeUser(socket.id);
        socket.leave(chatId);
        io.emit('userList', users);
    });
    socket.on('error', (error) => {
        console.error(`Socket error for client ${socket.id}:`, error);
    });
});
app.use('/api', (0, router_1.routes)(dependencies_1.default));
(0, server_1.default)(server, config_1.default).startServer();
