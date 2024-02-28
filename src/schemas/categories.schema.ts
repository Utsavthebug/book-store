import {z} from 'zod';


export const categoryCreateSchema = z.object({
    name:z.string({
        required_error:"Name field is required",
    })
})


export const categoriesCreateSchema = z.object({
    categories : z.array(categoryCreateSchema)
})

// export const categoriesCreateSchema = z.array(categoryCreateSchema)

export type  categoryCreateType = z.infer<typeof categoryCreateSchema>
export type categoryType = z.infer<typeof categoriesCreateSchema>
