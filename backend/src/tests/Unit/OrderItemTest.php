<?php

namespace Tests\Unit;

use App\Models\OrderItem;
use PHPUnit\Framework\TestCase;

class OrderItemTest extends TestCase
{
    public function test_subtotal_calculates_quantity_times_unit_price(): void
    {
        $item = new OrderItem(['quantity' => 3, 'unit_price' => 1500]);

        $this->assertSame(4500, $item->subtotal());
    }
}
