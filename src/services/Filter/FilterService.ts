import { ILike, In, IsNull, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Not } from "typeorm";

export enum SortOrder{
    ASC="ASC",
    DESC="DESC"
}

export enum FilterRule {
    EQUALS = 'eq',
    NOT_EQUALS = 'neq',
    GREATER_THAN = 'gt',
    GREATER_THAN_OR_EQUALS = 'gte',
    LESS_THAN = 'lt',
    LESS_THAN_OR_EQUALS = 'lte',
    LIKE = 'like',
    NOT_LIKE = 'nlike',
    IN = 'in',
    NOT_IN = 'nin',
    IS_NULL = 'isnull',
    IS_NOT_NULL = 'isnotnull',
}

class GenericFilter{
    public page:string
    public pageSize:string;

    public orderBy?: string;
  
    public sortOrder?: SortOrder = SortOrder.DESC;
}

type Generic = {
    [key:string]:string;
}
export type WhereObject = { [key: string]: any };


export class PageService {
    public createOrderQuery(filter:GenericFilter & Generic){
        const order:any={}
        if(filter.orderBy){
            order[filter.orderBy] = filter.sortOrder
            return order
        }
        order.created_at = SortOrder.DESC
        return order
    }

    public paginateQuery(filter:any){
        const page = parseInt(filter.page as string) || 0
        const size = parseInt(filter.pageSize as string) || 20

        const take = size;
        const skip = (page-1)*size;

        return {
            skip,
            take,
            page,
            size
        }
    }

    public getWhere(query:GenericFilter & Generic){
        const Originalquery = {...query}
        Object.keys(query).forEach((q:string)=>{
            if(['page','pageSize','orderBy','sortOrder'].includes(q)){
                delete Originalquery[q]
            }
        })
        const where:WhereObject ={}
     
        Object.keys(Originalquery).forEach((q:string)=>{
        const [property,rule,value] = Originalquery[q].split(":")
        
        if (rule == FilterRule.IS_NULL) where[property]=IsNull();
        if (rule == FilterRule.IS_NOT_NULL) where[property]= Not(IsNull());
        if (rule == FilterRule.EQUALS) where[property]= value ;
        if (rule == FilterRule.NOT_EQUALS) where[property]= Not(value) ;
        if (rule == FilterRule.GREATER_THAN) where[property]= MoreThan(value);
        if (rule == FilterRule.GREATER_THAN_OR_EQUALS) where[property]= MoreThanOrEqual(value);
        if (rule == FilterRule.LESS_THAN) where[property]= LessThan(value);
        if (rule == FilterRule.LESS_THAN_OR_EQUALS) where[property]= LessThanOrEqual(value);
        if (rule == FilterRule.LIKE) where[property]= ILike(`%${value}%`);
        if (rule == FilterRule.NOT_LIKE) where[property]= Not(ILike(`%${value}%`));
        if (rule == FilterRule.IN) where[property]= In(value.split(','));
        if (rule == FilterRule.NOT_IN) where[property]= Not(In(value.split(',')));
        })    
    }
}