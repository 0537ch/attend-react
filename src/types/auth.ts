export type UserData = {
  id?: string | null;
  username?: string;
  [key: string]: unknown;
};

export type AuthContextType = {
  token: string | null;
  user: UserData | null;
  isAuthenticated: boolean;
  login: (employeeId: string, password: string) => Promise<void>;
  logout: () => void;
};

export interface LoginResponse {
  token: string;
  expired?: string;
  user?: UserData;
}
