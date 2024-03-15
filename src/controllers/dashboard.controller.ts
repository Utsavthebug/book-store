import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Order } from "../entities/order.entity";
import { dateutils } from "../helpers/helpers";
import { Orderproduct } from "../entities/orderproduct.entity";
import { StatusCodes } from "http-status-codes";

export class dashboardController{
    private static readonly orderrepository = AppDataSource.getRepository(Order)
    private static readonly orderproductrepository = AppDataSource.getRepository(Orderproduct) 

    //sales and order
    static async OrderStatistics(req:Request,res:Response){
        // const {startDate,endDate} = req.body
        const startDate = dateutils.getStartOfMonthUTC()
        const endDate = dateutils.getCurrentDateUTC()

        const betweendate = dateutils.BetweenDates(startDate,endDate)

        const [allOrders,totalOrders]   = await dashboardController.orderrepository.findAndCount({
            where:{
                created_at:betweendate
            }
        })

        //total amount sales 
        let totalamountsales = 0;

        if(allOrders.length>0){
            totalamountsales = allOrders.reduce((prev,current)=>{
               return prev+ (current? parseFloat(current.totalAmount+'') :0)},0)
        }

        console.log(totalamountsales)

        //total no of sales
        const productsorders = await dashboardController.orderproductrepository.find({
            where:{
                created_at:betweendate
            }
        })

        let numberofsales=0;

        if(productsorders.length>0){
          numberofsales =  productsorders.reduce((prev,current)=>prev+current?.amount,0)
        }

        return res.status(StatusCodes.OK).json({data:{
            totalOrders,
            numberofsales,
            totalamountsales
        }})
    } 

}