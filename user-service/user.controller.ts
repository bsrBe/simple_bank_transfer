import express, { Request , Response } from "express";
import {User} from "./user.entity";
import { AppDataSource } from "./data-source";
import { bankServiceAPI } from "./utils/https";

const userRepository = AppDataSource.getRepository(User);

export const createUser = async (req : Request , res : Response)=>{
    const {fullName , email , password ,bankId} =req.body;
    try {
          const newUser =  userRepository.create({
        fullName,
        email,
        password,
        bankId
    });
    await userRepository.save(newUser);
    res.status(201).json({
        message : "User created successfully",
        newUser
    })
}
     catch (error) {
        res.status(500).json({
            message: "Error creating user",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
}
export const getUsers = async(req : Request , res : Response)=>{

    try {
        const users = await userRepository.find({select :['id', 'fullName', 'email', 'bankId']});
         res.status(201).json({
        message : "Users fetched successfully",users

    })
    } catch (error) {
         res.status(500).json({
            message: "Error creating user",
            error: error instanceof Error ? error.message : "Unknown error"
    })
}
}

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Validate UUID format (optional, depending on strictness)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const singleUser = await userRepository.findOne({
      where: { id },
      select: ["id", "fullName", "email", "bankId"],
    });

    if (!singleUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      // Use 200 for GET
      message: "User fetched successfully",
      singleUser,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({
      message: "Error fetching user",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};



// export const getUserWithBalance = async (req: Request, res: Response) => {
//   try {
//     const id = req.params.id;
//     const user = await userRepository.findOneBy({ id });

//     if (!user) return res.status(404).json({ message: "User not found" });

//     // 🔁 Call bank-service for balance
//     const { data: account } = await bankServiceAPI.get(`/accounts/${id}`);

//     return res.json({
//       user,
//       account,
//     });
//   } catch (err: any) {
//     console.error("Error fetching balance:", err.message);
//     return res.status(500).json({ message: "Could not fetch balance" });
//   }
// };







export const getUserWithBalance = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log("Entering getUserWithBalance for userId:", id); // Add early log

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Fetch user
    const user = await userRepository.findOne({
      where: { id },
      select: ["id", "fullName", "email", "bankId"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Call bank service with correct path
    try {
      const url = `/bank/accounts/${id}`;
      console.log("Requesting bank service URL:", `${bankServiceAPI.defaults.baseURL}${url}`);
      const response = await bankServiceAPI.get(url);
      const { data: account } = response;
      return res.status(200).json({
        message: "User and balance fetched successfully",
        user,
        account,
      });
    } catch (bankError: any) {
      console.error("Bank service error:", {
        message: bankError.message,
        status: bankError.response?.status,
        data: bankError.response?.data,
        config: bankError.config?.url,
      });
      if (bankError.response?.status === 404) {
        return res.status(404).json({ message: "Account not found for user" });
      }
      return res.status(502).json({
        message: "Failed to fetch account balance from bank service",
        error: bankError.message || "Unknown error",
      });
    }
  } catch (error: any) {
    console.error("Error fetching user with balance:", error.message);
    return res.status(500).json({
      message: "Error fetching user or balance",
      error: error.message || "Unknown error",
    });
  }
};