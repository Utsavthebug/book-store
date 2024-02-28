import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { Base } from "./base.entity";
import  slugify from 'slugify'
import { Book } from "./book.entity";

@Entity({name:'categories'})
export class Categories extends Base {
    @Column({unique:true})
    name:string

    
    @Column({ type: "text", nullable: false,unique:true })
    slug: string;

    @ManyToOne((type)=>Categories,(category)=>category.children)
    parent:Categories

    @OneToMany((type)=>Categories,(category)=>category.parent)
    children:Categories[]

    @ManyToMany(()=>Book,(book)=>book.categories)
    books:Book[]

    @BeforeInsert()
    @BeforeUpdate()
    generateSlug(){
        const slugName = this.name.replace(','," ")
        this.slug = slugify(slugName,{lower:true})
    }
}