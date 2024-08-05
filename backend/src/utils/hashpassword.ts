import bcrypt from 'bcryptjs';
export const hashPassword=async(password:string):Promise<string>=>{
    try{
        const salt = await bcrypt.genSalt(10);
        const hashPassword=await bcrypt.hash(password,salt)
        return hashPassword;
    }
    catch(error){
        throw new Error('Error hashing password')
    }
}

