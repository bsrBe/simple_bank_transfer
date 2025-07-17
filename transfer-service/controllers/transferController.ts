import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Transfer } from "../entity/transfer";
import { bankServiceAPI } from "../utils/http";
import { AxiosError } from "axios";
import { producer } from "../utils/kafka";

interface BankAccount {
  id: number;
  userId: string;
  bankId: number;
  balance: number;
}

interface BankResponse {
  message: string;
  accounts: BankAccount[];
}

const transferRepo = AppDataSource.getRepository(Transfer);

export const createTransfer = async (req: Request, res: Response) => {
  try {
    const { senderId, receiverId, amount } = req.body;

    // Validate input
    if (!senderId || !receiverId || !amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid input: senderId, receiverId, and positive amount are required" });
    }

    // 1. Get sender's account
    let senderRes;
    try {
      senderRes = await bankServiceAPI.get<BankResponse>(`/accounts/${senderId}`);
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status === 404) {
        return res.status(404).json({ message: "Sender account not found" });
      }
      throw err;
    }

    const senderAccount = senderRes.data.accounts[0];
    if (!senderAccount || typeof senderAccount.balance !== "number") {
      return res.status(404).json({ message: "Sender account not found or invalid" });
    }

    if (senderAccount.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // 2. Get receiver's account
    let receiverRes;
    try {
      receiverRes = await bankServiceAPI.get<BankResponse>(`/accounts/${receiverId}`);
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status === 404) {
        return res.status(404).json({ message: "Receiver account not found" });
      }
      throw err;
    }

    const receiverAccount = receiverRes.data.accounts[0];
    if (!receiverAccount) {
      return res.status(404).json({ message: "Receiver account not found" });
    }

    // 5. Save transfer record
    const transfer = transferRepo.create({ senderId, receiverId, amount });
    await transferRepo.save(transfer);

    await producer.send({
  topic: "transfer-events",
  messages: [
    {
      value: JSON.stringify({ senderId, receiverId, amount }),
    },
  ],
});

    return res.status(201).json({ message: "Transfer successful", transfer });
  } catch (err: any) {
    console.error("Transfer error:", err);
    if (err instanceof AxiosError) {
      return res.status(500).json({ message: `Transfer failed: ${err.message}` });
    }
    return res.status(500).json({ message: "Transfer failed" });
  }
};