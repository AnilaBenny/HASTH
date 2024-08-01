import dotenv from 'dotenv';
dotenv.config();

export default{
port:process.env.PORT || 8080,
mongo:{
    uri:process.env.MONGODBURI 
}

}