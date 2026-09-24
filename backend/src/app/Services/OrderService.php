<?php

namespace App\Services;

use App\Models\Order;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class OrderService
{
    /**
     * 注文を作成する。在庫の排他制御を行い、在庫不足があれば例外を投げる。
     *
     * @param  array<string, mixed>  $data
     */
    public function create(User $user, array $data): Order
    {
        return DB::transaction(function () use ($user, $data) {
            $totalAmount = 0;
            $lockedVariants = [];

            foreach ($data['items'] as $item) {
                // lockForUpdate()で、このバリエーションの行を排他的にロックする。
                // 他のトランザクションが同じ行を更新しようとしている場合、
                // このトランザクションが完了するまで待たされる。
                $variant = ProductVariant::query()
                    ->where('id', $item['product_variant_id'])
                    ->lockForUpdate()
                    ->firstOrFail();

                if (! $variant->hasSufficientStock($item['quantity'])) {
                    throw new RuntimeException("「{$variant->sku}」の在庫が不足しています。");
                }

                $lockedVariants[] = [
                    'variant' => $variant,
                    'quantity' => $item['quantity'],
                ];

                $totalAmount += $variant->price * $item['quantity'];
            }

            $order = $user->orders()->create([
                'address_id' => $data['address_id'],
                'status' => 'pending',
                'total_amount' => $totalAmount,
                'ordered_at' => now(),
            ]);

            foreach ($lockedVariants as $entry) {
                $variant = $entry['variant'];
                $quantity = $entry['quantity'];

                $order->items()->create([
                    'product_variant_id' => $variant->id,
                    'quantity' => $quantity,
                    'unit_price' => $variant->price,
                ]);

                $variant->decrement('stock_quantity', $quantity);
            }

            return $order->load(['items.productVariant', 'address']);
        });
    }
}