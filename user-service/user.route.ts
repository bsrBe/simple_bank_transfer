import { Router } from "express";
import { createUser, getUsers, getUser } from "./user.controller";
const router = Router();

// Define the routes for user operations
router.post("/createUser" , createUser);
router.get("/getUsers", getUsers);
router.get("/getUser/:id", getUser);

export default router;