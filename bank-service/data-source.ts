import { DataSource } from "typeorm";
import { Bank} from "./entities/bank.entity"
import { BankAccount } from "./entities/bankAccount.entity";
import * as dotenv from "dotenv";

dotenv.config();
export const AppDataSource = new DataSource({
    type : "mariadb",
    host : process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || ****,
    username: process.env.DB_USERNAME || "****",
    password: process.env.DB_PASSWORD || "****", 
    database: process.env.DB_NAME    || "****",
    synchronize: true,
    logging: false,
    entities: [
        Bank,
        BankAccount,
    ],
    
})
