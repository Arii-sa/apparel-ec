<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductService
{
    /**
     * 商品とそのバリエーションを一括で作成する。
     *
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Product
    {
        return DB::transaction(function () use ($data) {
            $product = Product::create([
                'category_id' => $data['category_id'],
                'name' => $data['name'],
                'slug' => $this->generateUniqueSlug($data['name']),
                'description' => $data['description'] ?? null,
                'is_published' => $data['is_published'] ?? false,
            ]);

            foreach ($data['variants'] as $variant) {
                $product->variants()->create([
                    'sku' => $variant['sku'],
                    'size' => $variant['size'],
                    'color' => $variant['color'],
                    'price' => $variant['price'],
                    'stock_quantity' => $variant['stock_quantity'],
                ]);
            }

            return $product->load(['category', 'variants']);
        });
    }

    private function generateUniqueSlug(string $name): string
    {
        $slug = Str::slug($name) ?: Str::random(8);
        $originalSlug = $slug;
        $count = 1;

        while (Product::where('slug', $slug)->exists()) {
            $slug = "{$originalSlug}-{$count}";
            $count++;
        }

        return $slug;
    }
}