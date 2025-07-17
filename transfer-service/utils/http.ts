import axios from "axios";

export const bankServiceAPI = axios.create({
  baseURL: process.env.BANK_SERVICE_URL || "http://localhost:3002/api/bank",
  timeout: 5000,
});
