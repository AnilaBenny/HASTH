import http from 'http';
import express from 'express';
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
app.use((req, res, next) => {
  console.log('Session ID:', req.sessionID);
  console.log('Session Data:', req.session);
  next();
});

app.use(passport.initialize());
app.use(passport.session());
// app.use(middleware);
app.use('/api', routes(dependencies))


serverConfig(server, config).startServer();
