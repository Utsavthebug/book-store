import { Express,Request } from "express"

export interface CurrentUserType{
    id:string
}

declare global{
    namespace Express {
        interface Request {
            currentUser:CurrentUserType
        }
    }
}