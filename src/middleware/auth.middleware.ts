import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import { CurrentUserType } from "../custom";
import { StatusCodes } from "http-status-codes";

dotenv.config()
export const authentication = (req:Request,res:Response,next:NextFunction)=>{
    const {JWT_SECRET=""} = process.env
    const header = req.headers.authorization
    if(!header){
        return res.status(StatusCodes.UNAUTHORIZED).json({message:'Unauthorized'})
    }

    const token = header.split(" ")[1]
    if(!token){
        return res.status(401).json({message:'Unauthorized'})
    }
    const decode = jwt.verify(token,JWT_SECRET) as CurrentUserType

    if(!decode){
        return res.status(StatusCodes.UNAUTHORIZED).json({message:'Unauthorized'})
    }
    req["currentUser"] = decode;
    next()
}