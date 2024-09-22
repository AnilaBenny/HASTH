import express, { Express } from "express";
import cors from "cors";
import http from 'http';
const cookieParser=require("cookie-parser");


const expressConfig = (app: Express) => {
  const server = http.createServer(app);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser(process.env.COOKIEPARSERSECRET || 'default_secret'));
  app.use(express.static("public"));
  app.use('/src/uploads', express.static('src/uploads'));

  app.use(
    cors({
      origin: ["http://localhost:5173","https://www.hasthindia.shop","https://hasthindia.shop"],
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true,
    })
  );
};

export default expressConfig;
