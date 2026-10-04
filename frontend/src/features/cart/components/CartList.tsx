"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";

export function CartList() {
  const { items, isLoading, updateQuantity, removeItem, totalAmount } =
    useCart();

  if (isLoading) {
    return <p className="p-4 text-gray-500">読み込み中...</p>;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl p-4 text-center">
        <p className="text-gray-500">カートは空です。</p>
        <Link href="/" className="mt-4 inline-block text-sm underline">
          商品一覧を見る
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-4 p-4">
      <h1 className="text-2xl font-bold">カート</h1>

      <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200">
        {items.map((item) => (
          <li
            key={item.productVariantId}
            className="flex items-center justify-between gap-4 p-3"
          >
            <div>
              <p className="font-semibold">{item.productName}</p>
              <p className="text-sm text-gray-500">
                {item.size} / {item.color}
              </p>
              <p className="text-sm">¥{item.price.toLocaleString()}</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) =>
                  updateQuantity(
                    item.productVariantId,
                    Math.max(1, Number(e.target.value)),
                  )
                }
                className="w-16 rounded border border-gray-300 p-1 text-center"
              />
              <button
                onClick={() => removeItem(item.productVariantId)}
                className="text-sm text-red-500 hover:underline"
              >
                削除
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between text-lg font-bold">
        <span>合計</span>
        <span>¥{totalAmount.toLocaleString()}</span>
      </div>

      <Link
        href="/checkout"
        className="block w-full rounded bg-black py-2 text-center text-white"
      >
        レジに進む
      </Link>
    </div>
  );
}
