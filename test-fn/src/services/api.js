import axios from "axios";

const api = axios.create({
  baseURL: "https://timepawa.onrender.com/api",
  // baseURL: "http://localhost:7001/api",
  withCredentials: true,
});

export default api;
