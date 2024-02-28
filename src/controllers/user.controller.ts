import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/user.entity";
import { StatusCodes } from "http-status-codes";
import { UserRole, UserType,UserUpdateParams } from "../types/user.type";

export class UserController {
    private static readonly userRepository = AppDataSource.getRepository(User)

    public static async getAllUsers(req:Request,res:Response){
        //pagination
        const take = typeof req.query.take==='string' ? parseInt(req.query.take) : 10;
        const skip = typeof req.query.skip==='string' ? parseInt(req.query.skip) : 0;


        const [allUsers,total] = await UserController.userRepository.findAndCount({
           take: take,
           skip:skip 
        })
        return res.status(StatusCodes.OK).json({message:'success',data:allUsers,take,skip,total})
    }
    
    public static async updateUser(req:Request,res:Response){
        const {userId} = req.params
        const {
            name,
            email,
        } = req.body
        const newUser = await UserController.userRepository.findOne({
            where:{
                id:userId
            }
        })

        if(!newUser){
            return res.status(StatusCodes.NOT_FOUND).json({message:"User Not Found"})
        }

        if(!(req['currentUser'].id===userId || newUser.role===UserRole.ADMIN)){
            return res.status(StatusCodes.FORBIDDEN).json({message:"Forbidden"})
        }


        if(name) newUser.name = name
        if(email) newUser.email = email
        
        await UserController.userRepository.save(newUser)

        return res.status(StatusCodes.CREATED).json({message:'User Update Succesfully',data:newUser})
    }

    public static async getUser(req:Request,res:Response){
        const {userId} = req.params
        //getting user from user Id
        const user = await UserController.userRepository.findOne({
            where:{
                id:userId
            }
        }) 
        if(!user){
            return res.status(StatusCodes.NOT_FOUND).json({message:"User Not found"})
        }

        return res.status(StatusCodes.OK).json({data:user,message:'success'})
    }

    public static async deleteUser(req:Request,res:Response){
        const {userId} = req.params

        const newUser = await UserController.userRepository.findOne({
            where:{
                id:userId
            }
        })

        if(!newUser){
            return res.status(StatusCodes.NOT_FOUND).json({message:"User Not Found"})
        }

        newUser.isActive = false;
        await UserController.userRepository.save(newUser)

        return res.status(StatusCodes.OK).json({message:"User Succesfully deleted"})

    }

}