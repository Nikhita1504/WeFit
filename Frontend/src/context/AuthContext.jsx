import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    return localStorage.getItem('googleToken') || null;
  });

  const login = (newToken) => {
    localStorage.setItem('googleToken', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('googleToken');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);