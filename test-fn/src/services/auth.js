import api from "./api";

export const register = async (username, password) => {
  return await api.post("auth/register", {
    username,
    password,
  });
};

export const loginUser = async (username, password) => {
  return await api.post(
    "auth/login",
    {
      username,
      password,
    },
    {
      withCredentials: true,
    }
  );
};

export const authstatus = async () => {
  return await api.get("auth/status", {
    withCredentials: true,
  });
};

export const logoutUser = async () => {
  return await api.post(
    "auth/logout",
    {},
    {
      withCredentials: true,
    }
  );
};

export const setup2FA = async () => {
  return await api.post("auth/setup2fa", {}, { withCredentials: true });
};
export const verify2FA = async (token) => {
  return await api.post("auth/verify2fa", { token }, { withCredentials: true });
};
export const reset2fa = async () => {
  return await api.post("auth/reset", {}, { withCredentials: true });
};

export const fetchUsers = async () => {
  return await api.get("auth/users", {
    withCredentials: true,
  });
};
