import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Base } from "./base.entity";
import { Book } from "./book.entity";
import { Order } from "./order.entity";

@Entity({name:'orderproduct'})
export class Orderproduct extends Base {
    @PrimaryColumn()
     public orderId : string

    @PrimaryColumn()
    public bookId:string
    
    @Column({nullable:false,default:1})
    public amount:number

    @ManyToOne(()=>Order,(order)=>order.orderproducts)
    public order:Order

    @ManyToOne(()=>Book,(book)=>book.orderproducts)
    public book:Book

}