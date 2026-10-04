import Link from "next/link";

export default function OrderCompletePage() {
  return (
    <div className="mx-auto max-w-xl p-4 text-center">
      <h1 className="text-2xl font-bold">ご注文ありがとうございました</h1>
      <p className="mt-4 text-gray-600">注文を受け付けました。</p>
      <Link
        href="/"
        className="mt-6 inline-block rounded bg-black px-6 py-2 text-white"
      >
        商品一覧に戻る
      </Link>
    </div>
  );
}
