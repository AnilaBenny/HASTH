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

  app.use(
    cors({
      origin: ["http://localhost:3000"],
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true,
    })
  );
};

export default expressConfig;
