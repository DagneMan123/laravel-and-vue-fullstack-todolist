<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => ['required', 'email', 'max:255'],
            'password' => ['required', 'string', 'min:1'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => 'Email is required',
            'email.email' => 'Please enter a valid email address',
            'email.max' => 'Email must not exceed 255 characters',
            'password.required' => 'Password is required',
            'password.min' => 'Password is required',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     * Apply custom validation for security.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Additional validation: Check if email format looks valid
            $email = $this->input('email');
            if ($email && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $validator->errors()->add('email', 'Please enter a valid email address');
            }
        });

        return $validator;
    }
}

