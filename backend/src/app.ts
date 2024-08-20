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
app.use('/api', routes(dependencies))


serverConfig(server, config).startServer();
