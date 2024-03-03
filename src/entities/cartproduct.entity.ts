import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Base } from "./base.entity";
import { Cart } from "./cart.entity";
import { Book } from "./book.entity";

@Entity()
export class Cartproduct extends Base {
    @PrimaryColumn()
     public cartId : string

    @PrimaryColumn()
    public bookId:string
    
    @Column({nullable:false,default:1})
    public amount:number

    @ManyToOne(()=>Cart,(cart)=>cart.cartproducts)
    public cart:Cart

    @ManyToOne(()=>Book,(book)=>book.cartproducts)
    public book:Book

}