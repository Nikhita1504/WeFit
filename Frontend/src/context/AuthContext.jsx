import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    return localStorage.getItem('googleToken') || null;
  });
  const [JwtToken, setJwtToken] = useState(() => {
    return sessionStorage.getItem('JwtToken') || null;
  });

  const login = (newToken,jwtToken) => {
    localStorage.setItem('googleToken', newToken);
    sessionStorage.setItem('JwtToken', jwtToken);
    setToken(newToken);
    setJwtToken(jwtToken);
  };

  const logout = () => {
    localStorage.removeItem('googleToken');
    sessionStorage.removeItem('JwtToken');
    setToken(null);
    setJwtToken(null);
  };

  return (
    <AuthContext.Provider value={{ token,JwtToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);