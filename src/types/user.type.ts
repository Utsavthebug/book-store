export interface UserUpdateParams{
    userId:string;
}

export enum UserRole {
    ADMIN="admin",
    USER="user"
}

export interface AllUserQueryParams{
 take: number;
 skip:number;
}

export interface UserType{
    name:string;
    email:string;
    password:string;
    role: UserRole;
}
