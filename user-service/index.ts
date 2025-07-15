import "reflect-metadata";
import * as dotenv from "dotenv";
import express ,{Request , Response} from "express";
import { AppDataSource } from "./data-source";
import userRoute from "./user.route";
import {setupSwagger} from "./swagger";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.get("/", (req : Request, res : Response) => {
      res.send("Hello, Simple Bank!");
    });
app.use("/api/users", userRoute);

// Setup Swagger UI
setupSwagger(app);
// Initialize the database connection
const startServer = async ()=>{
    try {
        AppDataSource.initialize()
    .then(()=>{
        console.log("Data Source has been initialized!");
    }).catch((err)=>{
        console.error("Error during Data Source initialization", err);
    })
    app.listen(PORT , ()=>{
        console.log(`Server is running on port ${PORT}`);
    })
    } catch (error) {
        console.error("Error connecting to the database", error);
    }
}
startServer()

