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
    type:'enum',
    enum:paymentMethod,
    default:paymentMethod.COD
 })
 payment:paymentMethod

 @Column({
    default:0
 })
 discount:number;

 @Column({
    default:0
 })
 tax_amount:number;

 @Column({nullable:false})
 totalAmount:number

@ManyToOne(()=>User,(user)=>user.orders)
user:User

@OneToOne(()=>ShippingAddress,(address)=>address.order)
shippingadress:ShippingAddress

@OneToMany(()=>Orderproduct,(orderproduct)=>orderproduct.order)
orderproducts:Orderproduct[]

}

