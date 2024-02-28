import {z} from 'zod';

export const bookcreateSchema = z.object({
    title:z.string({required_error:"Book field is required"}),
    description:z.string({required_error:"Description field is required"}),
    pageCount:z.number({required_error:"Pagecount field is required"}),
    isbn:z.string({required_error:"ISBN field is required"}),
    language:z.string({required_error:"Language  field is required"}),
    author:z.string({required_error:"Author field is required"}),
    categories:z.string().array().nonempty({message:"Category field cannot be empty"}),
    price:z.number({required_error:"Price field is required"})
})