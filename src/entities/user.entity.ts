import { Column, Entity } from "typeorm";
import { Base } from "./base.entity";
import { UserRole } from "../types/user.type";

@Entity({name:'users'})
export class User extends Base{
    @Column({nullable:false})
    name:string;

    @Column({nullable:false,unique:true})
    email:string;

    @Column({nullable:false,select:false})
    password:string;

    @Column({
        type:'enum',
        enum:UserRole,
        default:UserRole.USER,
    })
    role:UserRole

    @Column({
        nullable:true,
        select:false
    })
    passwordResetToken:string;

    @Column({
        nullable:true,
        select:false
    })
    tokenexpiry:Date;

    @Column({
        default:false
    })
    isActive:boolean
    
    }
