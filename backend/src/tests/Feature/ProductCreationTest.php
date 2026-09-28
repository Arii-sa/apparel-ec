<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProductCreationTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_product_with_variants(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $category = Category::factory()->create();
        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/admin/products', [
            'category_id' => $category->id,
            'name' => 'テストTシャツ',
            'description' => '説明文',
            'is_published' => true,
            'variants' => [
                ['sku' => 'TEST-SKU-M', 'size' => 'M', 'color' => 'ブラック', 'price' => 3900, 'stock_quantity' => 10],
                ['sku' => 'TEST-SKU-L', 'size' => 'L', 'color' => 'ブラック', 'price' => 3900, 'stock_quantity' => 5],
            ],
        ]);

        $response->assertCreated();
        $response->assertJsonCount(2, 'data.variants');
        $this->assertDatabaseHas('products', ['name' => 'テストTシャツ']);
        $this->assertDatabaseHas('product_variants', ['sku' => 'TEST-SKU-M']);
        $this->assertDatabaseHas('product_variants', ['sku' => 'TEST-SKU-L']);
    }

    public function test_customer_cannot_create_product(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $category = Category::factory()->create();
        Sanctum::actingAs($customer);

        $response = $this->postJson('/api/admin/products', [
            'category_id' => $category->id,
            'name' => 'テストTシャツ',
            'variants' => [
                ['sku' => 'TEST-SKU-M', 'size' => 'M', 'color' => 'ブラック', 'price' => 3900, 'stock_quantity' => 10],
            ],
        ]);

        $response->assertForbidden();
    }

    public function test_product_creation_fails_without_variants(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $category = Category::factory()->create();
        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/admin/products', [
            'category_id' => $category->id,
            'name' => 'テストTシャツ',
            'variants' => [],
        ]);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors(['variants']);
    }
}