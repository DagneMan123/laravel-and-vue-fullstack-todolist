<?php

namespace App\Http\Requests\Project;

use Illuminate\Foundation\Http\FormRequest;

class ProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'priority' => 'nullable|in:low,medium,high,urgent',
            'status' => 'nullable|in:active,completed,archived,on_hold',
            'color' => 'nullable|regex:/^#[0-9A-F]{6}$/i',
        ];
    }
}
