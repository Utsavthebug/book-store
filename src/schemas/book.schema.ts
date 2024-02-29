import {z} from 'zod';

export const bookcreateSchema = z.object({
    title:z.string({required_error:"Book field is required",invalid_type_error:"title must be string"}),
    description:z.string({required_error:"Description field is required",invalid_type_error:"Description must be string"}),
    pageCount:z.number({required_error:"Pagecount field is required",invalid_type_error:"Page count must be number"}),
    isbn:z.string({required_error:"ISBN field is required",invalid_type_error:" ISBN must be string"}),
    language:z.string({required_error:"Language  field is required",invalid_type_error:"Language must be string"}),
    author:z.string({required_error:"Author field is required",invalid_type_error:"Author must be string"}),
    categories:z.string().array().nonempty({message:"Category field cannot be empty"}),
    price:z.number({required_error:"Price field is required",invalid_type_error:"Price must be number"})
})

export const bookUpdateSchema = bookcreateSchema.partial()