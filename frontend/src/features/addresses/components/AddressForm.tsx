"use client";

import { useState, type FormEvent } from "react";
import { createAddress } from "../api";
import type { Address } from "../types";

type AddressFormProps = {
  token: string;
  onCreated: (address: Address) => void;
};

export function AddressForm({ token, onCreated }: AddressFormProps) {
  const [postalCode, setPostalCode] = useState("");
  const [prefecture, setPrefecture] = useState("");
  const [city, setCity] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const address = await createAddress(token, {
        postal_code: postalCode,
        prefecture,
        city,
        line1,
        line2: line2 || undefined,
        phone,
      });
      onCreated(address);
      setPostalCode("");
      setPrefecture("");
      setCity("");
      setLine1("");
      setLine2("");
      setPhone("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "不明なエラーが発生しました",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-lg border border-gray-200 p-4"
    >
      <h2 className="font-semibold">新しい住所を追加</h2>

      {error && (
        <p className="rounded bg-red-50 p-2 text-sm text-red-600">{error}</p>
      )}

      <input
        type="text"
        required
        placeholder="郵便番号(例: 150-0001)"
        value={postalCode}
        onChange={(e) => setPostalCode(e.target.value)}
        className="w-full rounded border border-gray-300 p-2 text-sm"
      />
      <input
        type="text"
        required
        placeholder="都道府県"
        value={prefecture}
        onChange={(e) => setPrefecture(e.target.value)}
        className="w-full rounded border border-gray-300 p-2 text-sm"
      />
      <input
        type="text"
        required
        placeholder="市区町村"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="w-full rounded border border-gray-300 p-2 text-sm"
      />
      <input
        type="text"
        required
        placeholder="番地"
        value={line1}
        onChange={(e) => setLine1(e.target.value)}
        className="w-full rounded border border-gray-300 p-2 text-sm"
      />
      <input
        type="text"
        placeholder="建物名・部屋番号(任意)"
        value={line2}
        onChange={(e) => setLine2(e.target.value)}
        className="w-full rounded border border-gray-300 p-2 text-sm"
      />
      <input
        type="text"
        required
        placeholder="電話番号"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full rounded border border-gray-300 p-2 text-sm"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded bg-black py-2 text-sm text-white disabled:opacity-50"
      >
        {isSubmitting ? "追加中..." : "住所を追加"}
      </button>
    </form>
  );
}
