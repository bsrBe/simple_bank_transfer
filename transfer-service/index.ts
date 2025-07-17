import "reflect-metadata";
import * as dotenv from "dotenv";
import express, { Request, Response } from "express";
import { AppDataSource } from "./data-source";
import { setupSwagger } from "./swagger";
import trasnferRoutes from "./routes/transferRoutes"
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());

// Setup routes

app.use("/api/transfer", trasnferRoutes);

// Setup Swagger UI
setupSwagger(app);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, transfer service is running!");
});

// Initialize the database connection
const startServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error during Data Source initialization", error);
  }
};

startServer();