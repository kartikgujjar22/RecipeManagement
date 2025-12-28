// client\src\context\AuthContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean; // Add loading state
  setIsAuthenticated: (status: boolean) => void;
  setUser: (user: User | null) => void; // Add setUser
  handleLogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Initial loading state
  const navigate = useNavigate();
  
  // NOTE: Ensure VITE_BACKEND_URL is correctly set in your .env file
  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || ''; 

  // Function to clear all local auth state
  const clearAuth = () => {
    setIsAuthenticated(false);
    setUser(null);
  };


  const handleLogout = async () => {
    try {
      await axios.post(
        `${VITE_BACKEND_URL}api/auth/logout`,
        {},
        { withCredentials: true }
      );
      
      clearAuth();
      console.log('Logout successful: Cookie cleared by server.');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      clearAuth();
      navigate('/login');
    }
  };

  // 🚀 INITIAL AUTH CHECK (Runs once on app load)
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Call a protected route to check the cookie's validity
        const response = await axios.get(`${VITE_BACKEND_URL}api/auth/status`, {
          withCredentials: true,
        });

        if (response.status === 200 && response.data.user) {
          setIsAuthenticated(true);
          setUser(response.data.user);
        } else {
          clearAuth();
        }
      } catch (error) {
        // Handle 401/403 (Invalid/Expired token)
        clearAuth();
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthStatus();
  }, [VITE_BACKEND_URL]);

  const value: AuthContextType = {
    isAuthenticated,
    user,
    loading,
    setIsAuthenticated,
    setUser,
    handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};