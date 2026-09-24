<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'=> $this->id,
            'quantity'=> $this->quantity,
            'unit_price'=> $this->unit_price,
            'subtotal'=> $this->subtotal(),
            'product_variant'=>[
                'id'=> $this->productVariant->id,
                'sku'=> $this->productVariant->sku,
                'size'=> $this->productVariant->size,
                'color'=> $this->productVariant->color
            ],
        ];
    }
}
