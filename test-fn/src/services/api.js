import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.REACT_APP_API_URL || "http://localhost:7001/api",
});

export default api;
