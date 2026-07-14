<?php

namespace App\Http\Requests\Task;

use Illuminate\Foundation\Http\FormRequest;

class TaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'priority' => ['required', 'in:low,medium,high,urgent'],
            'start_date' => ['nullable', 'date'],
            'start_time' => ['nullable', 'date_format:H:i'],
            'due_date' => ['nullable', 'date'],
            'due_time' => ['nullable', 'date_format:H:i'],
            'category_id' => ['nullable', 'exists:categories,id'],
        ];

        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            $rules['title'] = ['sometimes', 'required', 'string', 'max:255'];
            $rules['priority'] = ['sometimes', 'required', 'in:low,medium,high,urgent'];
            $rules['start_date'] = ['sometimes', 'nullable', 'date'];
            $rules['start_time'] = ['sometimes', 'nullable', 'date_format:H:i'];
            $rules['due_date'] = ['sometimes', 'nullable', 'date'];
            $rules['due_time'] = ['sometimes', 'nullable', 'date_format:H:i'];
            $rules['category_id'] = ['sometimes', 'nullable', 'exists:categories,id'];
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Task title is required',
            'title.max' => 'Task title cannot exceed 255 characters',
            'priority.required' => 'Priority is required',
            'priority.in' => 'Priority must be low, medium, high, or urgent',
            'start_date.date' => 'Please enter a valid start date',
            'start_time.date_format' => 'Please enter a valid start time (HH:MM)',
            'due_date.date' => 'Please enter a valid date',
            'due_time.date_format' => 'Please enter a valid time (HH:MM)',
            'category_id.exists' => 'The selected category does not exist',
        ];
    }
}
