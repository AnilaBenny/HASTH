import { User } from "./userSchema";
import { Admin } from "./adminSchema";
import { Otp } from "./otpSchema";
import { Post } from "./postSchema";

interface DatabaseSchemaType {
  User: typeof User;
  Admin: typeof Admin;
  Otp: typeof Otp;
  Post:typeof Post;
}

const databaseSchema: DatabaseSchemaType = {
  User,
  Admin,
  Otp,
  Post
};

export default databaseSchema;
