import { Router } from "express";
import {
  createBank,
  createBankAccount,
  getAccountByUserId,
  updateBalance,
} from "../controllers/bankController";

const router = Router();

router.post("/banks", createBank);
router.post("/accounts", createBankAccount);
router.get("/accounts/:userId", getAccountByUserId);
router.put("/accounts/:userId/balance", updateBalance); // deposit or send

export default router;
