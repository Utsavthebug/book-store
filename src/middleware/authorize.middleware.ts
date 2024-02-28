import { NextFunction,Request,Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/user.entity";
import { UserRole } from "../types/user.type";

export const authorization = ()=>{
    return async(req:Request,res:Response,next:NextFunction)=>{
        const userRepo = AppDataSource.getRepository(User)
        const user = await userRepo.findOne({
            where:{
                id:req['currentUser'].id
            }
        })
        if(user && user.role===UserRole.ADMIN){
            next()
        }
        else{
         return res.status(403).json({ message: "Forbidden" });
        }
       }
}