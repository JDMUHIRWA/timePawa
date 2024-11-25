import api from "./api";
export const Register = async (username, email, password) => {
  return await api.post("/register", {
    username,
    email,
    password,
  });
};
