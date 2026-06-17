import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://ecommerce-store-f5y1.vercel.app/api/profile", {
      method: "GET",
      credentials: "include"
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setUser(res.user.user);
        } else {
          setUser(null);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const logout = async () => {
    try {
      await fetch("http://localhost:8000/api/logout", {
        method: "POST",
        credentials: "include"
      });
    } catch (error) {
      console.log("Logout error:", error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
