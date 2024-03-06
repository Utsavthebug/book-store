import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";


@Entity({name:'shipping_address'})
export class ShippingAddress {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    state:string

    @Column()
    ward:number

    @Column()
    city:string

    @OneToOne(()=>Order,(order)=>order.shippingadress)
    @JoinColumn()
    order:Order
}