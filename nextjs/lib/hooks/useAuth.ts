'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, User, getAuthToken, setAuthToken, removeAuthToken } from '../api/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = getAuthToken();
    if (token) {
      try {
        const userData = await authApi.getUser();
        setUser(userData);
      } catch (error) {
        removeAuthToken();
        setUser(null);
      }
    }
    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    setAuthToken(response.access_token);
    setUser(response.user);
    router.push('/posts');
  };

  const register = async (name: string, email: string, password: string, password_confirmation: string) => {
    const response = await authApi.register({ name, email, password, password_confirmation });
    setAuthToken(response.access_token);
    setUser(response.user);
    router.push('/posts');
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      removeAuthToken();
      setUser(null);
      router.push('/login');
    }
  };

  return { user, loading, login, register, logout, isAuthenticated: !!user };
};