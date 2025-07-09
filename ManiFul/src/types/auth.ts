export type AuthCredentials = {
  email: string;
  password: string;
};

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (credentials: AuthCredentials) => Promise<authRes>;
  logout: () => Promise<void>;
  loading: boolean;
};

export type authRes = {
  status: number;
  message: string;
};

export type User = {
  email: string;
  id: number;
  username: string;
};
