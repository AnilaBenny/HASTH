import { User } from "./userSchema";
import { Admin } from "./adminSchema";
import { Otp } from "./otpSchema";
import { Post } from "./postSchema";
import { Report } from "./reportSchema";
import { Product } from "./productSchema";
import {Cart} from './cartSchema';
import {Order} from './orderSchema';
import { RealTimeChat } from "./RealTimeChatSchema";
import { Conversation } from "./conversationSchema";

interface DatabaseSchemaType {
  User: typeof User;
  Admin: typeof Admin;
  Otp: typeof Otp;
  Post:typeof Post;
  Report:typeof Report;
  Product:typeof Product;
  Cart:typeof Cart;
  Order:typeof Order;
  RealTimeChat:typeof RealTimeChat;
  Conversation:typeof Conversation;
}

const databaseSchema: DatabaseSchemaType = {
  User,
  Admin,
  Otp,
  Post,
  Report,
  Product,
  Cart,
  Order,
  RealTimeChat,
  Conversation
};

export default databaseSchema;
