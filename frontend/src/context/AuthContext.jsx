import React, { createContext, useState, useEffect } from "react";
import API from "../api/axios";

// Create the context
export const AuthContext = createContext();

// Provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

 
  const fetchUser = async () => {
    try {
      const response = await API.get("/users/profile/");
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    const response = await API.post("/token/", { username, password });
    localStorage.setItem("access", response.data.access);
    localStorage.setItem("refresh", response.data.refresh);
    await fetchUser();
  };

  const register = async (userData) => {
  
    await API.post("/users/register/", userData);
    
  
    const loginResponse = await API.post("/token/", {
      username: userData.username,
      password: userData.password
    });
    
    localStorage.setItem("access", loginResponse.data.access);
    localStorage.setItem("refresh", loginResponse.data.refresh);
    
  
    await fetchUser();
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser,
      isAuthenticated, 
      setIsAuthenticated,
      login, 
      register, 
      logout, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}