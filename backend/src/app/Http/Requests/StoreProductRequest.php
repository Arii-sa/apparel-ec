<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'category_id' => ['required', 'integer', Rule::exists('categories', 'id')],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_published' => ['boolean'],

            'variants' => ['required', 'array', 'min:1'],
            'variants.*.sku' => ['required', 'string', 'max:255', 'distinct', Rule::unique('product_variants', 'sku')],
            'variants.*.size' => ['required', 'string', 'max:50'],
            'variants.*.color' => ['required', 'string', 'max:50'],
            'variants.*.price' => ['required', 'integer', 'min:0'],
            'variants.*.stock_quantity' => ['required', 'integer', 'min:0'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'category_id.required' => 'カテゴリを選択してください。',
            'category_id.exists' => '指定されたカテゴリが存在しません。',
            'name.required' => '商品名を入力してください。',
            'name.max' => '商品名は255文字以内で入力してください。',

            'variants.required' => 'バリエーションを1つ以上登録してください。',
            'variants.min' => 'バリエーションを1つ以上登録してください。',
            'variants.*.sku.required' => 'SKUを入力してください。',
            'variants.*.sku.distinct' => 'SKUがリクエスト内で重複しています。',
            'variants.*.sku.unique' => 'このSKUは既に使用されています。',
            'variants.*.size.required' => 'サイズを入力してください。',
            'variants.*.color.required' => 'カラーを入力してください。',
            'variants.*.price.required' => '価格を入力してください。',
            'variants.*.price.min' => '価格は0以上で入力してください。',
            'variants.*.stock_quantity.required' => '在庫数を入力してください。',
            'variants.*.stock_quantity.min' => '在庫数は0以上で入力してください。',
        ];
    }
}