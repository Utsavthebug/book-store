import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/user.entity";
import { encrypt } from "../helpers/helpers";
import { StatusCodes } from "http-status-codes";
import EmailService from "../services/email/EmailService";
import { resetPasswordEmailTemplate } from "../services/email/emailTemplate";

export class AuthController{
    private static readonly userRepository = AppDataSource.getRepository(User)

    public static async login(req:Request,res:Response){
        const {email,password} = req.body

        const user = await AuthController.userRepository.createQueryBuilder('user')
        .where("user.email = :email",{email})
        .addSelect('user.password')
        .getOne()

        if(!user){
           return res.status(StatusCodes.NOT_FOUND).json({message:"User not found"})
        }
        //comparing password
        const isPasswordValid =await encrypt.comparepassword(user.password,password)
        if(!isPasswordValid){
           return res.status(StatusCodes.NOT_FOUND).json({message:"Invalid Credentials"})
        }

        const {password:discardPassword,...rest} = user

        const token = encrypt.generateToken({id:user.id})
        
        return res.status(StatusCodes.OK).json({message:"Login Succesful",token,user:rest})
    }

    public static async register(req:Request,res:Response){
        const {name,email,password,role} = req.body

        //get user
        const hasUser = await AuthController.userRepository.findOne({
            where:{
                email:email
            }
        })
        if(hasUser){
            return res.status(StatusCodes.BAD_REQUEST).json({message:"Email is already used"})
        }

        //hash password
        const hashedPassword =await encrypt.encryptpass(password)

        const user = new User()
        user.name=name
        user.password=hashedPassword
        user.email=email
        user.role=role
        user.isActive=true

        //getting respository
        await AuthController.userRepository.save(user)

        //generating token 
        const token = encrypt.generateToken({id:user.id})

        res.status(StatusCodes.CREATED).json({message:"User Created Succesfully",token,user})
    }

    public static async changePassword(req:Request,res:Response){
        const {oldpassword,newpassword} = req.body;
        const userId = req["currentUser"].id
        
        const user = await AuthController.userRepository.findOne({
            where:{
                id:userId
            }
        })

        if(!user){
           return res.status(StatusCodes.NOT_FOUND).json({})
        }

        //checking password
        const isPasswordValid = encrypt.comparepassword(user.password,oldpassword)
        
        if(!isPasswordValid){
        return res.status(StatusCodes.BAD_REQUEST).json({message:"Incorrect Old Password"})
        }
        
        const encryptPassword = await encrypt.encryptpass(newpassword)
        user.password = encryptPassword;

        await AuthController.userRepository.save(user)

        return res.status(StatusCodes.CREATED).json({message:"Password changed Succesfully"})
   
    }

    public static async forgetPassword(req:Request,res:Response){
        const {email} = req.body

        const user = await AuthController.userRepository.findOne({
            where:{
                email:email
            }
        })

        if(!user){
            return res.status(StatusCodes.BAD_REQUEST).json({message:"User not found"})
        }
        const randomData = encrypt.generatePasswordResetToken()
        //hash the reset token 
        const hashedrandomData = await encrypt.encryptpass(randomData)
        const currentDate = new Date().getTime()

        const tenMinutesLater = new Date(currentDate + 10 * 60000);

        user.passwordResetToken = hashedrandomData
        user.tokenexpiry = tenMinutesLater

        //sending email
        //message
        const emailmsg = resetPasswordEmailTemplate({
            name:user.name,
            token:randomData,
            id:user.id
        })

        const emailService = new EmailService()
        await emailService.sendEmail({
            to:user.email,
            subject:'Reset Password',
            html:emailmsg
        })

        //sending email services 
        return res.status(StatusCodes.OK).json({message:"Check Your Email"})
    }

    
    public static async resetPassword(req:Request,res:Response){
        const {token,userId,password} = req.body

        //checking if token is valid 
        const user = await AuthController.userRepository.findOne({
            where:{
                id:userId
            }
        })

        if(user){      
        //checking if token is valid 
        let isTokenValid = false;        

        if(user.tokenexpiry){
            const PasswordNotExpired =  new Date() < user.tokenexpiry
            const PasswordValid = await encrypt.comparepassword(user.passwordResetToken,token)
            isTokenValid = PasswordNotExpired && PasswordValid    
        }

        if(!isTokenValid){
            return res.status(StatusCodes.FORBIDDEN).json({message:"Password Reset Token is expired"})
        }

        user.password = password
        await AuthController.userRepository.save(user)

        return res.status(StatusCodes.OK).json({message:"Password Reset Succesful"})
        }

    }
}