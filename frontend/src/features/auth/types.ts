export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export type AuthResponse = {
  user: User;
  token: string;
};
