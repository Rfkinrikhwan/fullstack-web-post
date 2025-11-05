import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://post-app-be.test';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  token_type: string;
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  /**
   * Registers a new user.
   * @param {RegisterData} data - The registration data.
   * @returns {Promise<AuthResponse>} A promise that resolves with the authentication response.
   * @throws {Error} If the registration fails.
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/api/register', data);
    return response.data;
  },

  /**
   * Logs in a user.
   * @param {LoginData} data - The login credentials.
   * @returns {Promise<AuthResponse>} A promise that resolves with the authentication response.
   */
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/api/login', data);
    return response.data;
  },

  /**
   * Logs out the authenticated user.
   * This will invalidate the current access token, and should be called when the user wants to log out.
   * @returns {Promise<void>} A promise that resolves when the user has been logged out.
   */
  logout: async (): Promise<void> => {
    await api.post('/api/logout');
  },

  /**
   * Retrieves the authenticated user.
   * @returns {Promise<User>} A promise that resolves with the authenticated user.
   */
  getUser: async (): Promise<User> => {
    const response = await api.get('/api/user');
    return response.data;
  },
};


/**
 * Sets the authentication token in a cookie that expires in 7 days.
 * @param {string} token - The authentication token to be set.
 */
export const setAuthToken = (token: string) => {
  Cookies.set('token', token, { expires: 7 });
};


/**
 * Removes the authentication token from the cookie.
 */
export const removeAuthToken = () => {
  Cookies.remove('token');
};

/**
 * Returns the authentication token stored in the cookie.
 * @returns {string} The authentication token or null if not found.
 */
export const getAuthToken = () => {
  return Cookies.get('token');
};