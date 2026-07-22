<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    /**
     * List of disposable email domains
     */
    protected $disposableEmailDomains = [
        'tempmail.com',
        'throwaway.email',
        'guerrillamail.com',
        '10minutemail.com',
        'mailinator.com',
        'temp-mail.org',
        'maildrop.cc',
        'yopmail.com',
        'fakeinbox.com',
        'dispostable.com',
        'trashmail.com',
    ];

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'min:2',
                'max:255',
                'regex:/^[\p{L}\s\-\']+$/u', // Allow Unicode letters, spaces, hyphens, apostrophes
            ],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:users,email',
                function ($attribute, $value, $fail) {
                    $this->validateEmailDomain($value, $fail);
                    $this->validateCommonEmailTypos($value, $fail);
                },
            ],
            'password' => [
                'required',
                'confirmed',
                Password::min(8)
                    ->mixedCase()
                    ->numbers()
                    ->uncompromised(),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Name is required',
            'name.min' => 'Name must be at least 2 characters long',
            'name.regex' => 'Name can only contain letters, spaces, hyphens, and apostrophes',
            'email.required' => 'Email is required',
            'email.email' => 'Please enter a valid email address',
            'email.unique' => 'This email is already registered',
            'email.max' => 'Email must not exceed 255 characters',
            'password.required' => 'Password is required',
            'password.min' => 'Password must be at least 8 characters',
            'password.mixed_case' => 'Password must contain both uppercase and lowercase letters',
            'password.numbers' => 'Password must contain at least one number',
            'password.uncompromised' => 'This password has been compromised in a data breach. Please choose a different password',
            'password.confirmed' => 'Password confirmation does not match',
        ];
    }

    /**
     * Validate that email domain is not a disposable service
     */
    protected function validateEmailDomain($email, $fail)
    {
        $domain = strtolower(substr(strrchr($email, '@'), 1));
        
        if (in_array($domain, $this->disposableEmailDomains)) {
            $fail('Please use a permanent email address, not a temporary email service');
        }
    }

    /**
     * Check for common email typos and suggest corrections
     */
    protected function validateCommonEmailTypos($email, $fail)
    {
        $commonTypos = [
            'gmial.com' => 'gmail.com',
            'gmai.com' => 'gmail.com',
            'gmil.com' => 'gmail.com',
            'yaoo.com' => 'yahoo.com',
            'yaho.com' => 'yahoo.com',
            'outlok.com' => 'outlook.com',
            'outlo.com' => 'outlook.com',
            'hotmial.com' => 'hotmail.com',
            'hotmai.com' => 'hotmail.com',
        ];

        $domain = strtolower(substr(strrchr($email, '@'), 1));
        
        if (isset($commonTypos[$domain])) {
            $fail("Did you mean " . $commonTypos[$domain] . "?");
        }
    }

    /**
     * Custom validation after standard validation
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Additional password validation: check for weak patterns
            $password = $this->input('password');
            if ($password) {
                $this->validatePasswordPatterns($password, $validator);
            }

            // Validate name doesn't have suspicious patterns
            $name = $this->input('name');
            if ($name) {
                $this->validateNamePatterns($name, $validator);
            }
        });

        return $validator;
    }

    /**
     * Check for weak password patterns
     */
    protected function validatePasswordPatterns($password, $validator)
    {
        // Check for sequential numbers
        if (preg_match('/012|123|234|345|456|567|678|789|890/', $password)) {
            $validator->errors()->add('password', 'Password cannot contain sequential numbers like 123');
        }

        // Check for repeated characters
        if (preg_match('/(.)\1{2,}/', $password)) {
            $validator->errors()->add('password', 'Password cannot contain repeated characters (aaa, 111, etc.)');
        }

        // Check for common weak patterns
        $commonPatterns = ['password', 'qwerty', 'admin', '12345', 'welcome'];
        $lowerPassword = strtolower($password);
        foreach ($commonPatterns as $pattern) {
            if (strpos($lowerPassword, $pattern) !== false) {
                $validator->errors()->add('password', 'Password is too common. Please choose a stronger password');
                break;
            }
        }
    }

    /**
     * Validate name doesn't have suspicious patterns
     */
    protected function validateNamePatterns($name, $validator)
    {
        // Check for any numbers
        if (preg_match('/\d/', $name)) {
            $validator->errors()->add('name', 'Name cannot contain numbers');
        }

        // Check for repeated special characters (though regex should catch most)
        if (preg_match('/(.)\1{2,}/', $name)) {
            $validator->errors()->add('name', 'Name contains invalid repeated characters');
        }
    }
}
