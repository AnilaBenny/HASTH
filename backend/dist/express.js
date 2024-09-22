"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const cookieParser = require("cookie-parser");
const expressConfig = (app) => {
    const server = http_1.default.createServer(app);
    app.use((0, cors_1.default)({
        origin: ['https://www.hasthindia.shop', 'http://localhost:5173', 'https://hasth.onrender.com/'],
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
    }));
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use(cookieParser(process.env.COOKIEPARSERSECRET || 'default_secret'));
    app.use(express_1.default.static("public"));
    app.use('/src/uploads', express_1.default.static('src/uploads'));
};
exports.default = expressConfig;
