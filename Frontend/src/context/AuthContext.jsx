import { createContext, useContext, useEffect, useState } from "react";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../api/auth.api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await getCurrentUser();
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data)); // ✅ persist
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (data) => {
    const res = await loginUser(data);
    localStorage.setItem("token", res.data.token);
    await fetchUser();
    return res;
  };

  const register = async (data) => {
    const res = await registerUser(data);
    localStorage.setItem("token", res.data.token);
    await fetchUser();
    return res;
  };

  const logout = async () => {
    await logoutUser();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null); // ✅ clear user
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser) {
      setUser(storedUser);
      setLoading(false);
    } else {
      fetchUser();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
