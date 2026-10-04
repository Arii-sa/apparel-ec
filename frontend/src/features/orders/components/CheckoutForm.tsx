"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useCart } from "@/features/cart/context/CartContext";
import { fetchAddresses } from "@/features/addresses/api";
import type { Address } from "@/features/addresses/types";
import { createOrder } from "../api";

export function CheckoutForm() {
  const router = useRouter();
  const { token, isLoading: isAuthLoading } = useAuth();
  const { items, totalAmount, clear } = useCart();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthLoading) return;

    const resolveAddresses = token
      ? fetchAddresses(token)
      : Promise.resolve([]);

    resolveAddresses
      .then((fetchedAddresses) => {
        setAddresses(fetchedAddresses);
        if (fetchedAddresses.length > 0) {
          setSelectedAddressId(fetchedAddresses[0].id);
        }
      })
      .catch((err: unknown) => {
        setError(
          err instanceof Error ? err.message : "不明なエラーが発生しました",
        );
      })
      .finally(() => {
        setIsLoadingAddresses(false);
      });
  }, [token, isAuthLoading]);

  async function handleSubmit() {
    if (!token || !selectedAddressId) return;

    setError(null);
    setIsSubmitting(true);

    try {
      await createOrder(token, {
        address_id: selectedAddressId,
        items: items.map((item) => ({
          product_variant_id: item.productVariantId,
          quantity: item.quantity,
        })),
      });

      clear();
      router.push("/orders/complete");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "不明なエラーが発生しました",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isAuthLoading || isLoadingAddresses) {
    return <p className="p-4 text-gray-500">読み込み中...</p>;
  }

  if (!token) {
    return (
      <p className="p-4 text-gray-500">注文手続きにはログインが必要です。</p>
    );
  }

  if (items.length === 0) {
    return <p className="p-4 text-gray-500">カートが空です。</p>;
  }

  return (
    <div className="mx-auto max-w-xl space-y-6 p-4">
      <h1 className="text-2xl font-bold">注文内容の確認</h1>

      {error && (
        <p className="rounded bg-red-50 p-2 text-sm text-red-600">{error}</p>
      )}

      <section>
        <h2 className="font-semibold">配送先住所</h2>
        {addresses.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">
            配送先住所が登録されていません。先に住所を登録してください。
          </p>
        ) : (
          <div className="mt-2 space-y-2">
            {addresses.map((address) => (
              <label
                key={address.id}
                className="flex items-start gap-2 rounded border border-gray-200 p-3 text-sm"
              >
                <input
                  type="radio"
                  name="address"
                  checked={selectedAddressId === address.id}
                  onChange={() => setSelectedAddressId(address.id)}
                  className="mt-1"
                />
                <span>
                  〒{address.postal_code} {address.prefecture}
                  {address.city}
                  {address.line1}
                  {address.line2}
                </span>
              </label>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-semibold">注文商品</h2>
        <ul className="mt-2 divide-y divide-gray-200 rounded-lg border border-gray-200">
          {items.map((item) => (
            <li
              key={item.productVariantId}
              className="flex justify-between p-3 text-sm"
            >
              <span>
                {item.productName} ({item.size}/{item.color}) × {item.quantity}
              </span>
              <span>¥{(item.price * item.quantity).toLocaleString()}</span>
            </li>
          ))}
        </ul>
        <div className="mt-2 flex justify-between font-bold">
          <span>合計</span>
          <span>¥{totalAmount.toLocaleString()}</span>
        </div>
      </section>

      <button
        onClick={handleSubmit}
        disabled={isSubmitting || !selectedAddressId}
        className="w-full rounded bg-black py-3 text-white disabled:opacity-50"
      >
        {isSubmitting ? "注文処理中..." : "注文を確定する"}
      </button>
    </div>
  );
}
