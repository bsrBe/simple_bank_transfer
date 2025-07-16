import axios from "axios";

export const bankServiceAPI = axios.create({
  baseURL: "http://localhost:3002/api",
  timeout: 5000,
});