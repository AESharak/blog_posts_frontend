export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  body: string;
  image_url?: string;
  image?: string;
  author: User;
  is_author: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
}

export interface LoginFormData {
  username: string;
  password: string;
}

export interface BlogPostFormData {
  title: string;
  body: string;
  image_url?: string;
  image?: File | FileList;
  author_id: number;
}
