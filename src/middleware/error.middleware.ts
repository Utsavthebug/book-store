import { NextFunction, Request, Response } from "express";

export const errorHandler = (error:Error,req:Request,res:Response,next:NextFunction)=>{
    const message = error.message || 'Internal Server Error'
    return  res.status(500).json({message})
}