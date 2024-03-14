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

export class dateutils {
   static getStartOfMonthUTC(day=1) {
        var now = new Date();
        var startOfMonthUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), day, 0, 0, 0, 0));
        return startOfMonthUTC;
    }

    static getCurrentDateUTC() {
        var now = new Date();
        var currentDateUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),0,0,0,0));
        return currentDateUTC;
    }
}