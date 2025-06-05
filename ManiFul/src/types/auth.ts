export type AuthCredentials = {
  email: string;
  password: string;
};

export type AuthContextType = {
  user: string | null;
  isAuthenticated: boolean;
  login: (credentials: AuthCredentials) => Promise<void>;
  logout: () => Promise<void>;
};
