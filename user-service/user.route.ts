import { Router } from "express";
import { createUser, getUsers, getUser,getUserWithBalance  } from "./user.controller";
const router = Router();

// Define the routes for user operations
router.post("/createUser" , createUser);
router.get("/getUsers", getUsers);
router.get("/getUser/:id", getUser);
router.get("/:id/with-balance", getUserWithBalance); // 👈 Add this
export default router;