import { NextFunction, Request, Response } from "express";

export const ErrorWrapper = (callback:(req:Request,res:Response,next?:NextFunction)=>Promise<Response<any, Record<string, any>>|undefined> | Promise<void>) => {
    return async (req:Request,res:Response,next:NextFunction)=>{
        try {
            await callback(req,res)
        } catch (error) {
            next(error)
        }
    }
}