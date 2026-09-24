<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'total_amount' => $this->total_amount,
            'ordered_at' => $this->ordered_at,
            'address' => [
                'postal_code' => $this->address->postal_code,
                'prefecture' => $this->address->prefecture,
                'city' => $this->address->city,
                'line1' => $this->address->line1,
                ],
                'items' => OrderItemResource::collection($this->whenLoaded('items')),
        ];
    }
}
