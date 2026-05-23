import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Check if a user is already saved in the browser when the app loads
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('flipkart_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('flipkart_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('flipkart_user');
    // Force a full reload to clear all cart/wishlist memory and send them to login
    window.location.href = '/login'; 
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};