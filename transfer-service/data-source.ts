import { DataSource } from "typeorm";
import  {Transfer}  from "./entity/transfer";
import * as dotenv from "dotenv";

dotenv.config();
export const AppDataSource = new DataSource({
    type : "mariadb",
    host : process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "142536bsr", 
    database: process.env.DB_NAME    || "transfer_service",
    synchronize: true,
    logging: false,
    entities: [
      Transfer
    ],
    
})
