import { User } from "./userSchema";
import { Admin } from "./adminSchema";
import { Otp } from "./otpSchema";

interface DatabaseSchemaType {
  User: typeof User;
  Admin: typeof Admin;
  Otp: typeof Otp;
}

const databaseSchema: DatabaseSchemaType = {
  User,
  Admin,
  Otp
};

export default databaseSchema;
