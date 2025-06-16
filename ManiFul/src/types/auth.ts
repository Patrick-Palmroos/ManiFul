export type AuthCredentials = {
  email: string;
  password: string;
};

export type AuthContextType = {
  user: string | null;
  isAuthenticated: boolean;
  login: (credentials: AuthCredentials) => Promise<authRes>;
  logout: () => Promise<void>;
};

export type authRes = {
  status: number;
  message: string;
};
