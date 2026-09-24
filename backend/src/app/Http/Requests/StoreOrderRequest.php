<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'address_id' => [
                'required',
                'integer',
                Rule::exists('addresses','id')->where('user_id', $this->user()?->id),
            ],

            'items'=> ['required','array','min:1'],
            'items.*.product_variant_id' => ['required', 'integer', Rule::exists('product_variants', 'id')],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ];
    }

    public function messages(): array{
        return [
            'address_id.required' => '配送先住所を選択してください。',
            'address_id.exists' => '指定された住所が見つかりません。',
            'items.required' => '注文する商品を1つ以上選択してください。',
            'items.min' => '注文する商品を1つ以上選択してください。',
            'items.*.product_variant_id.required' => '商品を選択してください。',
            'items.*.product_variant_id.exists' => '指定された商品が見つかりません。',
            'items.*.quantity.required' => '数量を入力してください。',
            'items.*.quantity.min' => '数量は1以上を指定してください。',
        ];
    }
}
