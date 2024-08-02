import { User } from "./userSchema";
import { Admin } from "./adminSchema";
import { Otp } from "./otpSchema";


interface databaseSchemaType{
User:typeof User,
Admin:typeof Admin,
Otp:typeof Otp
}
const databaseSchema:databaseSchemaType={
User,
Admin,
Otp
}
 export default {
    databaseSchema
}