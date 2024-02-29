import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Categories } from "../entities/categories.entity";
import { StatusCodes } from "http-status-codes";
import { categoryCreateType } from "../schemas/categories.schema";

export class CategoryController {
   private static readonly categoryrepository = AppDataSource.getRepository(Categories)

   public static async create(req:Request,res:Response){
    const {categories,parentId} = req.body

    //getting parent category Instance 
        let parentCategory:Categories|null;

        if(parentId){
            parentCategory = await CategoryController.categoryrepository.findOne({
                where:{
                    id:parentId
                }
            }) 
        }
         
    //inserting multiple data 
    const categoriesEntities = categories.map((data:categoryCreateType)=>{
        const categoryInstance = new Categories()
        categoryInstance.name = data.name
        if(parentCategory) categoryInstance.parent= parentCategory
        return categoryInstance
    })

    await CategoryController.categoryrepository.insert(categoriesEntities)
    return res.status(StatusCodes.CREATED).json({message:'succesfully created',data:categoriesEntities})
   }

   public static async getAll(req:Request,res:Response){
    // const allcategorites = await CategoryController.categoryrepository.find()
    const [allcategorites,count] = await CategoryController.categoryrepository
    .createQueryBuilder('category')
    .leftJoinAndSelect('category.children','children')
    .where('category.parent IS NULL')
    .getManyAndCount();

    return res.status(StatusCodes.OK).json({message:'Success',data:allcategorites,totalCategories:count})
   }

   public static async update(req:Request,res:Response){
    const {categoryId} = req.params
    const {name} = req.body

    //find category 
    const category = await CategoryController.categoryrepository.findOne({
        where:{
            id:categoryId
        }
    })

    if(!category){
        return res.status(StatusCodes.NOT_FOUND).json({message:'Invalid Category Id'})
    }

    if(name) category.name = name;

    await CategoryController.categoryrepository.save(category)

    return res.status(StatusCodes.CREATED).json({message:'Category Updated Succesfully',data:category})
   }

   public static async deleteCategory(req:Request,res:Response){
    const {categoryId} = req.params
    await CategoryController.categoryrepository.delete(categoryId)
   }

}