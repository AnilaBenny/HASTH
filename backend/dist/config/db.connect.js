"use strict";
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
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.set("strictQuery", true);
const connectDB = (config) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uri } = config.mongo;
        yield mongoose_1.default.connect('mongodb+srv://anilacbenny810:DaKDKX3EoAGjp1Io@hasth.arate.mongodb.net/HASTH');
        console.log("Connected to the MongoDB database");
    }
    catch (error) {
        console.error("Error connecting to the MongoDB database:", error);
        process.exit(1);
    }
});
exports.default = connectDB;
