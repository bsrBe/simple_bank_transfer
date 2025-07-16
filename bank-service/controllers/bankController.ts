import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Bank } from "../entities/bank.entity";
import { BankAccount } from "../entities/bankAccount.entity";

const bankRepo = AppDataSource.getRepository(Bank);
const accountRepo = AppDataSource.getRepository(BankAccount);

export const createBank = async (req: Request, res: Response) => {
  const { name } = req.body;
  const bank = bankRepo.create({ name });
  await bankRepo.save(bank);
  return res.status(201).json(bank);
};

export const createBankAccount = async (req: Request, res: Response) => {
  const { userId, bankId } = req.body;
  const account = accountRepo.create({ userId, bankId, balance: 0 });
  await accountRepo.save(account);
  return res.status(201).json(account);
};

export const getAccountByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    // Validate userId as a UUID string
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      return res.status(400).json({ message: "Invalid user ID format (must be a UUID)" });
    }
    // Use find instead of findOneBy to allow multiple accounts
    const accounts = await accountRepo.find({ where: { userId } });
    if (accounts.length === 0) {
      return res.status(404).json({ message: "No accounts found for user" });
    }
    res.status(200).json({
      message: "Bank accounts fetched successfully",
      accounts,
    });
  } catch (error) {
    console.error("Error fetching accounts:", error);
    res.status(500).json({
      message: "Error fetching bank accounts",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
export const updateBalance = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const { amount } = req.body;

  const account = await accountRepo.findOneBy({ userId });
  if (!account) return res.status(404).json({ message: "Not found" });

  account.balance += amount;
  await accountRepo.save(account);

  return res.json(account);
};
