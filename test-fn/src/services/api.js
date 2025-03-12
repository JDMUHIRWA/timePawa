import axios from "axios";
import process from "process";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:7001/api",
});

export default api;
