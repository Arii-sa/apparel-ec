const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type CreateOrderPayload = {
  address_id: number;
  items: { product_variant_id: number; quantity: number }[];
};

type OrderResponse = {
  data: {
    id: number;
    status: string;
    total_amount: number;
  };
};

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

export async function createOrder(
  token: string,
  payload: CreateOrderPayload,
): Promise<OrderResponse> {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  return response.json();
}
