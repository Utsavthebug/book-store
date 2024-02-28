import { Response,Request } from "express";
import { AppDataSource } from "../data-source";
import { Book } from "../entities/book.entity";
import { Categories } from "../entities/categories.entity";
import { StatusCodes } from "http-status-codes";

export class BookController {
    private static readonly bookrepository = AppDataSource.getRepository(Book)
    private static readonly categoryrepository = AppDataSource.getRepository(Categories)

    public static async createBook(req:Request,res:Response){
        const {
            title,
            description,
            pageCount,
            weight,
            isbn,
            language,
            author,
            price,
            categories
        } = req.body

        let categoryInstances = []
        //getting categories instance 
        if(categories.length>0){
            categoryInstances =await Promise.all(categories.map(async(category:string)=>{
                const categoryInstance = await BookController.categoryrepository.findOne({
                    where:{
                        id:category
                    }
                })
                return categoryInstance;
            }))
        }
        const book = new Book()
        book.title=title
        book.description=description
        book.pageCount=pageCount
        book.weight=weight
        book.isbn=isbn
        book.language=language
        book.author=author
        book.price=price
        book.categories=categoryInstances
       
        const createdBook = await BookController.bookrepository.save(book)

        return res.status(StatusCodes.CREATED).json({message:'Book Created Succesfully',data:createdBook})
    }

    public static async getBooks(req:Request,res:Response){
        //getting query builder 
        const bookqueryBuilder = BookController.bookrepository.createQueryBuilder('books')
        const sortBy = req.query.sort_by

        if(req.query.genre){
        bookqueryBuilder.leftJoinAndSelect('books.categories','categories').where("categories.slug = :categoryslug",{categoryslug:req.query.genre})
        }
   
        if(req.query.sub_genre){
        bookqueryBuilder.leftJoinAndSelect('books.categories','subcategories').where("subcategories.slug = :subcategoryslug",{subcategoryslug:req.query.sub_genre})
        }


        if(sortBy){
            if(sortBy==="new_arrival")  bookqueryBuilder.orderBy("books.created_at","DESC")
            if(sortBy==="bestsellers")  bookqueryBuilder.andWhere("books.isbestSeller = true")
            if(sortBy==="with_discount") bookqueryBuilder.andWhere("books.with_discount = true")
            if(sortBy==="out_of_stock")  bookqueryBuilder.andWhere("books.stock = 0")
        }
       
        //paginate book results 
        let {page,limit} = req.query

        const current_page=parseInt(page as string) 
        const per_page = parseInt(limit as string)
        const skip = (current_page-1)*per_page

        if(current_page>0 && !isNaN(current_page) && per_page>0 && isNaN(per_page)){
         bookqueryBuilder.offset(skip).limit(per_page)
        }

        //selecting price 
        const price_range = req.query.price as string;

        if(price_range){
            if(price_range.includes("-")){
                const [minimum,maximum] = price_range.split("-")
                bookqueryBuilder.andWhere("books.price>= :minimum and books.price<=:maximum",{maximum,minimum})
            }
            if(price_range[price_range.length-1]==='+'){
                const minimum = parseInt(price_range.replace("+",""))
                bookqueryBuilder.andWhere("books.price>=:minimum",{minimum})
            }


        }



        // const pagination = {
        //     total:count,
        //     count:count,
        //     current_page:page,
        //     per_page:size,
        //     total_pages: Math.ceil(count/size)

        // }

        // return res.status(StatusCodes.OK).json({message:"Success",data:books,pagination})
    }
}
