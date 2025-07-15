import express, { Request , Response } from "express";
import {User} from "./user.entity";
import { AppDataSource } from "./data-source";


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