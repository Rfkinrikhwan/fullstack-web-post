import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

export interface PaginatedPosts {
  data: Post[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface CreatePostData {
  title: string;
  content: string;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const postsApi = {

  /**
   * Fetches all posts from the API with pagination and optional search.
   * @param {number} [page=1] The page number to fetch.
   * @param {number} [perPage=10] The number of items per page.
   * @param {string} [search=''] The search query to filter posts by title.
   * @returns {Promise<PaginatedPosts>} A promise that resolves with the paginated posts.
   */
  getAll: async (page: number = 1, perPage: number = 10, search: string = ''): Promise<PaginatedPosts> => {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });
    
    if (search) {
      params.append('title', search);
    }
    
    const response = await api.get(`/api/v1/posts?${params.toString()}`);
    return response.data;
  },

  /**
   * Get a post by its ID.
   * @param {string} id The ID of the post to get.
   * @returns {Promise<{ data: Post }>} A promise that resolves with the post.
   */
  getById: async (id: string): Promise<{ data: Post }> => {
    console.log(id)
    const response = await api.get(`/api/v1/posts/${id}`);
    return response.data;
  },

  /**
   * Create a new post.
   * @param {CreatePostData} data The data to create the post with.
   * @returns {Promise<{ data: Post }>} A promise that resolves with the created post.
   */
  create: async (data: CreatePostData): Promise<{ data: Post }> => {
    const response = await api.post('/api/v1/posts', data);
    return response.data;
  },

  /**
   * Update a post by its ID.
   * @param {number} id The ID of the post to update.
   * @param {UpdatePostData} data The data to update the post with.
   * @returns {Promise<{ data: Post }>} A promise that resolves with the updated post.
   */
  update: async (id: string, data: UpdatePostData): Promise<{ data: Post }> => {
    const response = await api.put(`/api/v1/posts/${id}`, data);
    return response.data;
  },

  /**
   * Delete a post by its ID.
   * @param {number} id The ID of the post to delete.
   * @returns {Promise<void>} A promise that resolves when the post has been deleted.
   */
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/v1/posts/${id}`);
  },
};