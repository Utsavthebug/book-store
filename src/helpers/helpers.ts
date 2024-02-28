import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'
import * as dotenv from 'dotenv'
import * as crypto from 'crypto';

dotenv.config()

const {JWT_SECRET = ""} = process.env

export class encrypt{
    static async encryptpass(password:string){
        return bcrypt.hash(password,12);
    }
    static async comparepassword(hashPassword:string,password:string){
        return await bcrypt.compare(password,hashPassword)
    }
    static generateToken(payload:any){
        return jwt.sign(payload,JWT_SECRET,{expiresIn:'1d'})
    }

    static generatePasswordResetToken(){
        const token = crypto.randomBytes(20).toString('hex')
        return token;
    }
}