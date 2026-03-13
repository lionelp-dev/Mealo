<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBetaRequestRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Public endpoint - anyone can submit
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => [
                'required',
                'email',
                'max:255',
                // Email must not already exist in beta_requests with pending or approved status
                Rule::unique('beta_requests', 'email')->where(function ($query) {
                    return $query->whereIn('status', ['pending', 'approved']);
                }),
                // Email must not already exist as a registered user
                Rule::unique('users', 'email'),
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'email.required' => 'L\'adresse email est requise.',
            'email.email' => 'L\'adresse email doit être valide.',
            'email.max' => 'L\'adresse email ne doit pas dépasser 255 caractères.',
            'email.unique' => 'Cette adresse email a déjà été enregistrée.',
        ];
    }
}
