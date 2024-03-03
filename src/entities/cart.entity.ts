import { Entity, ManyToOne, OneToMany } from "typeorm";
import { Base } from "./base.entity";
import { User } from "./user.entity";
import { Cartproduct } from "./cartproduct.entity";


@Entity({name:'cart'})
export class Cart extends Base {
    @ManyToOne(()=>User,(user)=>user.carts)
    user:User

    @OneToMany(()=>Cartproduct,cartproduct=>cartproduct.cart)
    public cartproducts:Cartproduct

}