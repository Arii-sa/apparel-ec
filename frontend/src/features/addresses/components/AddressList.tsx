"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { fetchAddresses } from "../api";
import type { Address } from "../types";
import { AddressForm } from "./AddressForm";

export function AddressList() {
  const { token, isLoading: isAuthLoading } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthLoading) return;

    const resolveAddresses = token
      ? fetchAddresses(token)
      : Promise.resolve([]);

    resolveAddresses
      .then(setAddresses)
      .catch((err: unknown) => {
        setError(
          err instanceof Error ? err.message : "不明なエラーが発生しました",
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [token, isAuthLoading]);

  if (isAuthLoading || isLoading) {
    return <p className="p-4 text-gray-500">読み込み中...</p>;
  }

  if (!token) {
    return (
      <p className="p-4 text-gray-500">
        住所を登録するにはログインしてください。
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6 p-4">
      <h1 className="text-2xl font-bold">配送先住所</h1>

      {error && (
        <p className="rounded bg-red-50 p-2 text-sm text-red-600">{error}</p>
      )}

      {addresses.length === 0 ? (
        <p className="text-gray-500">登録済みの住所はありません。</p>
      ) : (
        <ul className="space-y-2">
          {addresses.map((address) => (
            <li
              key={address.id}
              className="rounded-lg border border-gray-200 p-3 text-sm"
            >
              <p>〒{address.postal_code}</p>
              <p>
                {address.prefecture}
                {address.city}
                {address.line1}
                {address.line2}
              </p>
              <p className="text-gray-500">{address.phone}</p>
            </li>
          ))}
        </ul>
      )}

      <AddressForm
        token={token}
        onCreated={(address) => setAddresses((prev) => [address, ...prev])}
      />
    </div>
  );
}
