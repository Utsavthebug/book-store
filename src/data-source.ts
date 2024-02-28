import { DataSource } from "typeorm";
import dotenv from 'dotenv';

dotenv.config()
const {POSTGRES_DB,POSTGRES_PASS,POSTGRES_USER,POSTGRES_PORT } = process.env



export const AppDataSource = new DataSource({
    type:'postgres',
    host:'localhost',
    port: parseInt(POSTGRES_PORT || "5432") ,
    username:POSTGRES_USER,
    password:POSTGRES_PASS,
    database:POSTGRES_DB,
    synchronize:true,
    entities:["src/entities/*.ts"],
    subscribers:[],
    migrations:["src/migrations/*.ts"]
})