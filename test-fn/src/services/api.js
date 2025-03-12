import axios from "axios";

console.log(import.meta.env.VITE_API_URL);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:7001/api",
  withCredentials: true,
});

export default api;
