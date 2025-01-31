import { createContext, useContext, useEffect, useState } from "react";
import React from "react";

const SessionContext = createContext({});
export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
  const [loggedIn, setloggedin] = useState(false);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(localStorage.getItem("role"));
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    console.log("This is our stored user: ", storedUser);
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setloggedin(true);
      setRole(parsedUser.role);
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    setloggedin(true);
    setRole(userData.role);
    sessionStorage.setItem("user", JSON.stringify(userData));
  };
  const logout = () => {
    setUser({});
    setRole("");
    setloggedin(false);
    sessionStorage.removeItem("user");
  };

  return (
    <SessionContext.Provider
      value={{ login, logout, loading, loggedIn, user, role }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export default SessionContext;
