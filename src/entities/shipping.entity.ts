import { Column} from "typeorm";

export class ShippingAddress {
    @Column()
    state:string

    @Column()
    ward:string

    @Column()
    city:string
}