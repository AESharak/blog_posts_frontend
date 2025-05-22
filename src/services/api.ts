import axios from "axios";
import type {
  AuthResponse,
  BlogPost,
  BlogPostFormData,
  LoginFormData,
  RegisterFormData,
  User,
} from "../types";

const API_URL = "http://localhost:8000/api";

// Axios instance setup
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include the auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth APIs
export const authAPI = {
  register: async (data: RegisterFormData): Promise<User> => {
    const response = await api.post("/auth/register/", data);
    return response.data;
  },

  login: async (data: LoginFormData): Promise<AuthResponse> => {
    const response = await api.post("/auth/login/", data);
    localStorage.setItem("access_token", response.data.access);
    localStorage.setItem("refresh_token", response.data.refresh);
    return response.data;
  },

  logout: async (): Promise<void> => {
    const refresh = localStorage.getItem("refresh_token");
    if (refresh) {
      try {
        await api.post("/auth/logout/", { refresh_token: refresh });
      } catch (error) {
        console.error("Logout error:", error);
      }
    }
    // Always clear local storage even if API call fails
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get("/auth/me/");
    return response.data;
  },

  refreshToken: async (): Promise<AuthResponse> => {
    const refresh = localStorage.getItem("refresh_token");
    const response = await api.post("/auth/token/refresh/", { refresh });
    localStorage.setItem("access_token", response.data.access);
    localStorage.setItem("refresh_token", response.data.refresh);
    return response.data;
  },
};

// Blog APIs
export const blogAPI = {
  getAllPosts: async (): Promise<BlogPost[]> => {
    const response = await api.get("/blog/posts/");
    return response.data;
  },

  getPostBySlug: async (slug: string): Promise<BlogPost> => {
    const response = await api.get(`/blog/posts/${slug}/`);
    return response.data;
  },

  createPost: async (data: BlogPostFormData): Promise<BlogPost> => {
    console.log("Creating post with data:", data);
    // Handle file uploads
    if (data.image) {
      console.log("Handling image upload");
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("body", data.body);
      formData.append("author_id", data.author_id.toString());

      if (data.image_url) {
        formData.append("image_url", data.image_url);
      }

      // Use the first file from FileList instead of the whole FileList
      if (data.image instanceof FileList && data.image.length > 0) {
        formData.append("image", data.image[0]);
      } else if (data.image instanceof File) {
        formData.append("image", data.image);
      }

      try {
        const response = await api.post("/blog/posts/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Post created successfully:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error creating post with image:", error);
        if (error && typeof error === "object" && "response" in error) {
          console.error(
            "Error response data:",
            (error as { response?: { data?: unknown } }).response?.data
          );
        }
        throw error;
      }
    } else {
      try {
        console.log("Sending JSON data for post creation");
        const response = await api.post("/blog/posts/", data);
        console.log("Post created successfully:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error creating post:", error);
        if (error && typeof error === "object" && "response" in error) {
          console.error(
            "Error response data:",
            (error as { response?: { data?: unknown } }).response?.data
          );
        }
        throw error;
      }
    }
  },

  updatePost: async (
    slug: string,
    data: Partial<BlogPostFormData>
  ): Promise<BlogPost> => {
    // Create FormData for any update case
    const formData = new FormData();

    // Append basic fields if they exist
    if (data.title) formData.append("title", data.title);
    if (data.body) formData.append("body", data.body);
    if (data.author_id) formData.append("author_id", data.author_id.toString());

    // Handle image upload
    if (data.image) {
      // Use the first file from FileList instead of the whole FileList
      if (data.image instanceof FileList && data.image.length > 0) {
        formData.append("image", data.image[0]);
      } else if (data.image instanceof File) {
        formData.append("image", data.image);
      }
    }

    // Handle image URL
    if (data.image_url) {
      formData.append("image_url", data.image_url);
    }

    // Handle image removal - explicit flag to remove the image
    if (data.remove_image) {
      formData.append("remove_image", "true");
    }

    try {
      const response = await api.put(`/blog/posts/${slug}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating post:", error);
      if (error && typeof error === "object" && "response" in error) {
        console.error(
          "Error response data:",
          (error as { response?: { data?: unknown } }).response?.data
        );
      }
      throw error;
    }
  },

  deletePost: async (slug: string): Promise<void> => {
    await api.delete(`/blog/posts/${slug}/`);
  },

  getMyPosts: async (): Promise<BlogPost[]> => {
    const response = await api.get("/blog/posts/my_posts/");
    return response.data;
  },
};

export default api;
