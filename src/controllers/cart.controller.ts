import { Request,Response } from "express";
import { AppDataSource } from "../data-source";
import { Cart } from "../entities/cart.entity";
import { Cartproduct } from "../entities/cartproduct.entity";
import { StatusCodes } from "http-status-codes";

export class CartController {
    private static readonly cartrepository = AppDataSource.getRepository(Cart)
    private static readonly cartproductrepository = AppDataSource.getRepository(Cartproduct)

    public static async updateCartItem(req:Request,res:Response){
        const {cartproductId} = req.params
        const {amount} = req.body

        const cartProduct =  await CartController.cartproductrepository.findOne({
            where:{
             id:cartproductId   
            }
        })

        if(!cartProduct){
           return res.status(StatusCodes.NOT_FOUND).json({message:'Cart Product not found!'})
        }

        if(amount>0) cartProduct.amount = amount;

        const newcartProduct = await CartController.cartproductrepository.save(cartProduct)

        return res.status(StatusCodes.OK).json({data:newcartProduct,message:"Cart Updated Succesfully"})
    }

    public static async deleteCartItem(req:Request,res:Response){
        const {cartproductId} = req.params

        //delete using querybuilder 
        await CartController.cartproductrepository.createQueryBuilder('cartproduct')
        .delete()
        .where("id = :id",{id:cartproductId})
        .execute()

        res.status(StatusCodes.OK).json({message:"Deleted Succesfully"})
    }

    public static async getCartItems(req:Request,res:Response){
        const userId = req['currentUser'].id

        //getting cartId from user id 
        const cart = await CartController.cartrepository.findOne({
            where:{
                user:{
                    id:userId
                }
            }
        })


        if(!cart){
            return res.status(StatusCodes.NOT_FOUND).json({message:'Cart Not Found'})
        }

        const cartProductList = await CartController.cartproductrepository.createQueryBuilder('cart_product')
        .where("cart_product.cartId = :cartId",{cartId:cart.id})
        .leftJoinAndSelect("cart_product.book","book")
        .select(["cart_product.id","book","cart_product.amount"])
        .getMany()

     return res.status(StatusCodes.OK).json({message:'Sucess',data:cartProductList})
    }

    public static async createCart(req:Request,res:Response){
        const userId = req['currentUser'].id;

        //getting cart Items from req
        const {cartItems} = req.body

        //getting cart from req object 
        let cart = await CartController.cartrepository.findOne({
            where:{
                user:{
                    id:userId
                }
            }
        })

        if(!cart){
           let cartInstance = CartController.cartrepository.create({
                user:{
                    id:userId
                }
            }) 
         cart= await CartController.cartrepository.save(cartInstance)
        }

        //loop through all cartItems 
        if(cartItems.length>0){
            for(const el of cartItems) {
               //check if cartItems 
               const cartproduct = await CartController.cartproductrepository.findOne({
                where:{
                    cartId:cart?.id,
                    bookId:el.product
                }
               })
               if(cartproduct){
                cartproduct.amount +=el.amount
                await CartController.cartproductrepository.save(cartproduct)
               }
               else{
                let cartInstance = CartController.cartproductrepository.create({
                    cartId:cart?.id,
                    bookId:el.product,
                    amount:el.amount
                })
                await CartController.cartproductrepository.save(cartInstance)
               }      
            };
        }
        else{
            res.status(StatusCodes.BAD_REQUEST).json({message:'cart Items cannot be empty'})
        }

        const allcartItems = await CartController.cartrepository.findOne({
            relations:{
                cartproducts:{
                    cart:true,
                    book:true
                }
            },
            where:{
                user:{
                    id:userId
                }
            }
        })
        res.status(StatusCodes.OK).json({message:"created",data:allcartItems})
    }

}