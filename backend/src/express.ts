import express, { Express } from "express";
import cors from "cors";
import http from 'http';
const cookieParser=require("cookie-parser");


const expressConfig = (app: Express) => {
  const server = http.createServer(app);
 
  app.use(
    cors({
      origin: ['https://www.hasthindia.shop','http://localhost:5173'],
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true,
    })
  );
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser(process.env.COOKIEPARSERSECRET || 'default_secret'));
  app.use(express.static("public"));
  app.use('/src/uploads', express.static('src/uploads'));


  
};

export default expressConfig;

