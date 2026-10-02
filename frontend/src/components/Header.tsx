"use client";

import Link from "next/link";
import { useAuth } from "@/features/auth/context/AuthContext";

export function Header() {
  const { user, isLoading, logout } = useAuth();

  return (
    <header className="flex items-center justify-between border-b border-gray-200 p-4">
      <Link href="/" className="text-lg font-bold">
        apparel-ec
      </Link>

      <nav className="flex items-center gap-4 text-sm">
        {isLoading ? null : user ? (
          <>
            <Link href="/account/addresses" className="hover:underline">
              配送先住所
            </Link>
            <span>{user.name}さん</span>
            <button
              onClick={() => logout()}
              className="text-gray-500 hover:underline"
            >
              ログアウト
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:underline">
              ログイン
            </Link>
            <Link href="/register" className="hover:underline">
              会員登録
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
