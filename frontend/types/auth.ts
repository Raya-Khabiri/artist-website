export type AuthUser = {
  id: number;
  full_name: string;
  is_staff: boolean;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: AuthUser;
  access: string;
  refresh: string;
};

export type RegisterData = {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirm: string;
};

export type RegisterResponse = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
};

export type AuthSession = {
  user: AuthUser;
};