<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $categories = collect(['トップス', 'ボトムス', 'アウター', 'シューズ'])
            ->map(fn (string $name) => Category::create([
                'name' => $name,
                'slug' => Str::slug($name, '-', 'ja') ?: Str::random(8),
            ]));

        $sizes = ['S', 'M', 'L', 'XL'];
        $colors = ['ブラック', 'ホワイト', 'ネイビー', 'ベージュ', 'カーキ'];

        $categories->each(function (Category $category) use ($sizes, $colors) {
            Product::factory()
                ->count(5)
                ->for($category)
                ->create()
                ->each(function (Product $product) use ($sizes, $colors) {
                    collect($sizes)
                        ->crossJoin($colors)
                        ->shuffle()
                        ->take(3)
                        ->each(fn (array $combo) => ProductVariant::factory()
                            ->for($product)
                            ->create([
                                'size' => $combo[0],
                                'color' => $combo[1],
                            ]));
                });
        });
    }
}