import { Entity,Column, ManyToOne, ManyToMany, JoinTable, Index, OneToMany } from "typeorm";
import { Base } from "./base.entity";
import { Categories } from "./categories.entity";
import { Cartproduct } from "./cartproduct.entity";
import { Orderproduct } from "./orderproduct.entity";

@Entity({name:'books'})
export class Book extends Base{
    @Column({nullable:false})
    title:string

    @Column({nullable:false,type:'text'})
    description:string

    @Column({nullable:false})
    pageCount:number

    @Column({nullable:false})
    weight:number

    @Column({nullable:false})
    isbn:string

    @Column({nullable:false})
    language:string

    @Column({nullable:false})
    author:string
    
    @Column({nullable:false})
    price:number

    @Column({nullable:false,default:false})
    isbestSeller:boolean;

    @Column({default:0})
    stock:number;

    @ManyToMany(()=>Categories,(category)=>category.books,{onDelete:'CASCADE'})
    @JoinTable()
    categories:Categories[]

    @OneToMany(()=>Cartproduct,cartproduct=>cartproduct.book)
    public cartproducts:Cartproduct[]

    @OneToMany(()=>Orderproduct,(orderproduct)=>orderproduct.book)
    public orderproducts:Orderproduct[]

}