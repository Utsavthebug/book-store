import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Order } from "../entities/order.entity";
import { StatusCodes } from "http-status-codes";
import { Cartproduct } from "../entities/cartproduct.entity";
import { User } from "../entities/user.entity";
import { Orderproduct } from "../entities/orderproduct.entity";
import { Cart } from "../entities/cart.entity";
import { ShippingAddress } from "../entities/shipping.entity";

export class OrderController {
    private static readonly orderrepository = AppDataSource.getRepository(Order)
    private static readonly orderproductrepository = AppDataSource.getRepository(Orderproduct) 
    private static readonly cartproductrepsitory = AppDataSource.getRepository(Cartproduct)
    private static readonly userrepository = AppDataSource.getRepository(User)
    private static readonly cartrepository = AppDataSource.getRepository(Cart)

    public static async createOrder(req:Request,res:Response){
        const userId = req['currentUser'].id;
            const {
                cartId,
                orderStatus,
                paymentMethod,
                state,
                ward,
                city,
                discount=0
            } = req.body
    
            //getting cart products 
    
            const cartproducts = await OrderController.cartproductrepsitory.find({
                relations:{
                    book:true
                },
                where:{
                    cartId:cartId
                }
            })
            
            if(!(cartproducts.length>0)){
                return res.status(StatusCodes.NOT_FOUND).json({
                    message:"Cart Products is empty"
                })
            }
            
            //creating orders from cart
            const user = await OrderController.userrepository.findOne({
                where:{
                    id:userId
                }
            })
    
            if(!user){
                return res.status(StatusCodes.NOT_FOUND).json({message:"User not found"})
            }
    
    
            //calculating total amount 
            const totalCartAmount = cartproducts.reduce((acc,cartproduct)=>acc+(cartproduct.amount*cartproduct.book.price),0)
            const discount_amount = (discount/100)*totalCartAmount
            const taxAmount = 0.13*totalCartAmount
            const final_amount = totalCartAmount+taxAmount-discount_amount        
        
    
            const order = new Order()
            order.user = user
            order.totalAmount=final_amount > 0 ? final_amount : 0
            order.tax_amount=taxAmount
            order.discount=discount_amount
            if(orderStatus) order.orderStatus=orderStatus
            if(paymentMethod) order.payment = paymentMethod
            order.shipping = new ShippingAddress()
            if(state) order.shipping.state = state
            if(ward) order.shipping.ward = ward
            if(city) order.shipping.city = city
    
            const OrderCreated = await OrderController.orderrepository.save(order)
            //creating order products 
            if(cartproducts.length>0){
                for(const cartproduct of cartproducts){
                    const orderproductInstance = OrderController.orderproductrepository.create({
                        orderId:OrderCreated.id,
                        amount:cartproduct.amount,
                        bookId:cartproduct.bookId
                    })
                await OrderController.orderproductrepository.save(orderproductInstance)
                }
            }
            //deleting cart after creating order 
            await OrderController.cartrepository.createQueryBuilder('cart')
            .delete()
            .where("cart.id = :cartId",{cartId:cartId})
            .execute()
    
           return res.status(StatusCodes.OK).json({message:'Order created Succesfully',data:OrderCreated})
       
    }

    public static async updateOrder(req:Request,res:Response){
        //getting order from orderId
        const {orderId} = req.params
        const {orderStatus,state,ward,city} = req.body


        const order = await OrderController.orderrepository.findOne({
            where:{
                id:orderId
            }
        })

        if(!order){
         return res.status(StatusCodes.NOT_FOUND).json({message:"Order data not found"})
        }

        if(orderStatus) order.orderStatus = orderStatus

        if(order.orderStatus==="pending" || order.orderStatus==="processing" ){
            if(state) order.shipping.state = state
            if(city) order.shipping.city = city
            if(ward) order.shipping.ward = ward
        }

        const updatedOrder = await OrderController.orderrepository.save(order)

        return res.status(StatusCodes.OK).json({message:'Order updated',data:updatedOrder})
    }

    public static async getmyOrders(req:Request,res:Response){
        const userId = req['currentUser'].id

        let {page,limit,sort,orderStatus} = req.query

      
        const userOrderquery = OrderController.orderproductrepository.createQueryBuilder('orderproducts')
        .innerJoinAndSelect('orderproducts.order','order')
        .innerJoin('order.user','user',"user.id = :userId",{userId})
        .innerJoinAndSelect('orderproducts.book','book')

        if(!sort){
            userOrderquery.orderBy('orderproducts.updated_at',"DESC")
        }

        if(orderStatus){
            userOrderquery.where('order.orderStatus = :orderStatus',{orderStatus})
        }

        if(limit){
        const parsedPage = parseInt(page as string) || 1
        const parsedLimit = parseInt(limit as string)
        const take = parsedLimit
        const skip = (parsedPage-1) * parsedLimit        
        userOrderquery.take(take).skip(skip)
        }

        const [userOrders,total] = await userOrderquery.getManyAndCount()

        const pagination = {
            total,
            page,
            limit
        }

        return res.status(StatusCodes.OK).json({data:userOrders,pagination})

    }
}