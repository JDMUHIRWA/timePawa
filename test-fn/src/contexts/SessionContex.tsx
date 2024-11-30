import { createContext, useContext, useEffect, useState } from "react";
import React from "react";

const SessionContext = createContext({});
export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
  const [loggedIn, setloggedin] = useState(false);
  const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    console.log("This is our stored user: ", storedUser);
    if (storedUser) {
      setUser(storedUser);
      setloggedin(true);
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    setloggedin(true);
    sessionStorage.setItem("user", JSON.stringify(userData));
  };
  const logout = () => {
    setUser({});
    setloggedin(false);
    sessionStorage.removeItem("user");
  };

  return (
    <SessionContext.Provider value={{ login, logout, loading, loggedIn, user }}>
      {children}
    </SessionContext.Provider>
  );
};

export default SessionContext;
