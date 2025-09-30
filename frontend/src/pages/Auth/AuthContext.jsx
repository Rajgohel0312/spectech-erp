import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      const storedRoles = JSON.parse(localStorage.getItem("roles") || "[]");
      setUser(storedUser);
      setRoles(storedRoles);
    } else {
      setUser(null);
      setRoles([]);
    }
  }, [token]);

  const login = (userData, tokenValue, rolesData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", tokenValue);
    localStorage.setItem("roles", JSON.stringify(rolesData));
    setUser(userData);
    setToken(tokenValue);
    setRoles(rolesData);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
    setRoles([]);
  };

  return (
    <AuthContext.Provider value={{ user, roles, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
