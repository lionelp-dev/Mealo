<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateWorkspace extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Authorization handled in controller
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|required|string|max:255',
            'is_personal' => [
                'sometimes',
                'boolean',
                function ($attribute, $value, $fail) {
                    $workspace = $this->route('workspace');
                    if ($workspace->is_default && $value !== $workspace->is_personal) {
                        $fail('Le type d\'un espace par défaut ne peut pas être modifié.');
                    }
                },
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Le nom de l\'espace est obligatoire.',
            'name.max' => 'Le nom de l\'espace ne peut pas dépasser 255 caractères.',
        ];
    }
}
