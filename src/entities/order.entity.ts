import { Column, Entity, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { Base } from "./base.entity";
import { User } from "./user.entity";
import { ShippingAddress } from "./shipping.entity";
import { Orderproduct } from "./orderproduct.entity";

enum OrderStatus {
    PENDING="pending",
    PROCESSING="processing",
    SHIPPED="shipped",
    DELIVERED="delivered",
    CANCELED="canceled"

}

enum paymentMethod  {
    COD="cash on delivery",
    khalti="khalti",
    esewa="esewa"
}

@Entity({name:'orders'})
export class Order extends Base {
 @Column({
    type:'enum',
    enum:OrderStatus,
    default:OrderStatus.PENDING
 })
 orderStatus:OrderStatus;

 @Column({
   default:false
})
isPaid:boolean

 @Column({
    type:'enum',
    enum:paymentMethod,
    default:paymentMethod.COD
 })
 payment:paymentMethod

 @Column({
    default:0
 })
 discount:number;

 @Column({type: "decimal", precision: 10, scale: 2, default: 0})
 tax_amount:number;

@Column({type: "decimal", precision: 10, scale: 2, default: 0})
 totalAmount:number

@ManyToOne(()=>User,(user)=>user.orders)
user:User

@Column(()=>ShippingAddress)
shipping:ShippingAddress

@OneToMany(()=>Orderproduct,(orderproduct)=>orderproduct.order)
orderproducts:Orderproduct[]

}

