<?php

namespace App\Http\Requests\Category;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // 1. ከራውቱ ላይ የካቴጎሪውን ID በደኅንነት ያወጣል
        $category = $this->route('category');
        $categoryId = is_object($category) ? $category->id : $category;

        // 2. የአሁኑን ሎግኢን ያደረገ ተጠቃሚ ID ያገኛል
        $userId = $this->user()?->id;

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                // እጅግ በጣም ንጹህ እና ስህተት የማያመጣው የላራቬል Rule መዋቅር
                Rule::unique('categories', 'name')
                    ->ignore($categoryId)
                    ->where(function ($query) use ($userId) {
                        return $query->where('user_id', $userId);
                    }),
            ],
            'color' => 'nullable|string|max:7',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Category name is required',
            'name.unique' => 'You already have a category with this name',
            'color.string' => 'Color must be a valid hex code',
        ];
    }
}
