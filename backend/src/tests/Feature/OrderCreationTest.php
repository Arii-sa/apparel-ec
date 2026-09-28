<?php

namespace Tests\Feature;

use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class OrderCreationTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_place_order_with_sufficient_stock(): void
    {
        $user = User::factory()->create();
        $address = $user->addresses()->create([
            'postal_code' => '123-4567',
            'prefecture' => '東京都',
            'city' => '渋谷区',
            'line1' => '1-2-3',
            'phone' => '090-1234-5678',
        ]);
        $variant = ProductVariant::factory()->create(['stock_quantity' => 5, 'price' => 3000]);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/orders', [
            'address_id' => $address->id,
            'items' => [
                ['product_variant_id' => $variant->id, 'quantity' => 2],
            ],
        ]);

        $response->assertCreated();
        $response->assertJsonPath('data.total_amount', 6000);
        $this->assertDatabaseHas('product_variants', ['id' => $variant->id, 'stock_quantity' => 3]);
        $this->assertDatabaseHas('orders', ['user_id' => $user->id, 'total_amount' => 6000]);
    }

    public function test_order_fails_when_stock_is_insufficient(): void
    {
        $user = User::factory()->create();
        $address = $user->addresses()->create([
            'postal_code' => '123-4567',
            'prefecture' => '東京都',
            'city' => '渋谷区',
            'line1' => '1-2-3',
            'phone' => '090-1234-5678',
        ]);
        $variant = ProductVariant::factory()->create(['stock_quantity' => 1]);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/orders', [
            'address_id' => $address->id,
            'items' => [
                ['product_variant_id' => $variant->id, 'quantity' => 5],
            ],
        ]);

        $response->assertStatus(409);
        $this->assertDatabaseCount('orders', 0);
        $this->assertDatabaseHas('product_variants', ['id' => $variant->id, 'stock_quantity' => 1]);
    }

    public function test_user_cannot_order_with_another_users_address(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $otherAddress = $otherUser->addresses()->create([
            'postal_code' => '999-9999',
            'prefecture' => '大阪府',
            'city' => '大阪市',
            'line1' => '9-9-9',
            'phone' => '090-0000-0000',
        ]);
        $variant = ProductVariant::factory()->create(['stock_quantity' => 5]);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/orders', [
            'address_id' => $otherAddress->id,
            'items' => [
                ['product_variant_id' => $variant->id, 'quantity' => 1],
            ],
        ]);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors(['address_id']);
    }
}