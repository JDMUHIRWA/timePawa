import axios from "axios";

const api = axios.create({
  baseURL: "https://timepawa.onrender.com/api",
  withCredentials: true,
});

export default api;
