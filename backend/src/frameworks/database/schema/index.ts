import { User } from "./userSchema";
import { Admin } from "./adminSchema";
import { Otp } from "./otpSchema";
import { Post } from "./postSchema";
import { Report } from "./reportSchema";
import { Product } from "./productSchema";

interface DatabaseSchemaType {
  User: typeof User;
  Admin: typeof Admin;
  Otp: typeof Otp;
  Post:typeof Post;
  Report:typeof Report;
  Product:typeof Product;
}

const databaseSchema: DatabaseSchemaType = {
  User,
  Admin,
  Otp,
  Post,
  Report,
  Product
};

export default databaseSchema;
