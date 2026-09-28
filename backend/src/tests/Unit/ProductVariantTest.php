<?php

namespace Tests\Unit;

use App\Models\ProductVariant;
use PHPUnit\Framework\TestCase;

class ProductVariantTest extends TestCase
{
    public function test_is_in_stock_returns_true_when_quantity_is_positive(): void
    {
        $variant = new ProductVariant(['stock_quantity' => 3]);

        $this->assertTrue($variant->isInStock());
    }

    public function test_is_in_stock_returns_false_when_quantity_is_zero(): void
    {
        $variant = new ProductVariant(['stock_quantity' => 0]);

        $this->assertFalse($variant->isInStock());
    }

    public function test_has_sufficient_stock(): void
    {
        $variant = new ProductVariant(['stock_quantity' => 5]);

        $this->assertTrue($variant->hasSufficientStock(5));
        $this->assertTrue($variant->hasSufficientStock(3));
        $this->assertFalse($variant->hasSufficientStock(6));
    }
}