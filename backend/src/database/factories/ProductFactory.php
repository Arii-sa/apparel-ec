<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */

class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->randomElement([
            'ベーシックTシャツ',
            'オーバーサイズパーカー',
            'デニムジャケット',
            'ワイドパンツ',
            'ニットセーター',
            'チノパンツ',
            'キャンバススニーカー',
            'レザーベルト',
        ]);

        return [
            'category_id' => Category::factory(),
            'name' => $name,
            'slug' => Str::slug($name) ?: Str::random(8),
            'description' => fake()->realTextBetween(50, 150),
            'is_published' => true,
        ];
    }
}