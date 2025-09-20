import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';

const AuthContext = createContext();

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
      fetchCurrentUser();
    }
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await api.post('/login', { username, password });
      const data = response.data;
      // Handle different possible response formats
      const newToken = data.token || data.access_token || data.jwt;
      const userData = data.user || data.profile || { username, email: data.email };

      if (!newToken) {
        throw new Error('No token received from server');
      }

      setToken(newToken);
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('token', newToken);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message || 'Login failed' };
    }
  };

  const register = async (username, password, email) => {
    try {
      const response = await api.post('/register', { username, password, email });
      const data = response.data;
      // Handle different possible response formats
      const newToken = data.token || data.access_token || data.jwt;
      const userData = data.user || data.profile || { username, email };

      if (!newToken) {
        throw new Error('No token received from server');
      }

      setToken(newToken);
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('token', newToken);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message || 'Registration failed' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get('/users/me');
      setUser(response.data);
    } catch (error) {
      // Don't logout on failure, just log the error
      console.error('Failed to fetch user details:', error);
      // Keep the user data from login if available
    }
  };

  const value = {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    fetchCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { useAuth };
export default AuthProvider;