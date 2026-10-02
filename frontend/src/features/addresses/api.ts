import type { Address, NewAddress } from "./types";

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

export async function fetchAddresses(token: string): Promise<Address[]> {
  const response = await fetch(`${API_BASE_URL}/addresses`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  const json = await response.json();
  return json.data;
}

export async function createAddress(
  token: string,
  address: NewAddress,
): Promise<Address> {
  const response = await fetch(`${API_BASE_URL}/addresses`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(address),
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  const json = await response.json();
  return json.data;
}
