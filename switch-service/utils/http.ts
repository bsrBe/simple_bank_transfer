import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const bankServiceAPI = axios.create({
  baseURL: "http://localhost:3002",
  timeout: 5000,
});
