'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { getUserProfile, logout } from 'src/api';
import User from 'src/models/User';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  fetchUserProfile: () => Promise<void>,
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!user;

  const handleLogout = async () => {
    try {
      setLoading(true)
      await logout();
      setLoading(false)
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const { data } = await getUserProfile();
      setUser(data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, fetchUserProfile, logout: handleLogout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
