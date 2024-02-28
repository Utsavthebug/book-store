import "reflect-metadata"
import dotenv from 'dotenv';
import express,{ Express,Request,Response } from "express";
import { AppDataSource } from "./data-source";
import { errorHandler } from "./middleware/error.middleware";
import { StatusCodes } from "http-status-codes";
import { rootRouter } from "./routes";

dotenv.config()

const app:Express = express()
const port = process.env.PORT || 3000;


app.use(express.json())

app.use("/api/v1",rootRouter)
app.get('*',(req:Request,res:Response)=>{
  res.status(StatusCodes.NOT_FOUND).json({message:"Bad Request"})
})


app.use(errorHandler)


AppDataSource.initialize().then(async()=>{
  console.log("Database Connected")
  app.listen(port,()=>{
  console.log(`[server]:server is running at http://localhost:${port}`)
  })
}).catch((err)=>{
  console.error("Error during data source initialization",err)
  process.exit(1)
})
