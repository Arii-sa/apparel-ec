import type { AuthResponse, User } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function parseErrorMessage(response: Response): Promise<string> {
  try {
    const json = await response.json();
    return (
      json.message ?? `リクエストに失敗しました (status: ${response.status})`
    );
  } catch {
    return `リクエストに失敗しました (status: ${response.status})`;
  }
}

export async function register(
  name: string,
  email: string,
  password: string,
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      name,
      email,
      password,
      password_confirmation: password,
    }),
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  return response.json();
}

export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  return response.json();
}

export async function logout(token: string): Promise<void> {
  await fetch(`${API_BASE_URL}/logout`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
}

export async function fetchCurrentUser(token: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/user`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error("ユーザー情報の取得に失敗しました");
  }

  return response.json();
}
