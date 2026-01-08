<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRecipeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
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
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'serving_size' => ['required', 'integer', 'min:1', 'max:50'],
            'preparation_time' => ['required', 'integer', 'min:0'],
            'cooking_time' => ['required', 'integer', 'min:0'],
            'meal_times' => ['required', 'array'],
            'meal_times.*.name' => ['string', 'max:255'],
            'ingredients' => ['required', 'array'],
            'ingredients.*.name' => ['required', 'string', 'max:255'],
            'ingredients.*.quantity' => ['required', 'numeric', 'min:0'],
            'ingredients.*.unit' => ['required', 'string', 'max:255'],
            'steps' => ['required', 'array'],
            'steps.*.order' => ['required', 'integer', 'min:0'],
            'steps.*.description' => ['required', 'string'],
            'tags' => ['required', 'array'],
            'tags.*.name' => ['string', 'max:255'],
            'image' => ['nullable', 'image', 'mimes:jpeg,jpg,png', 'max:5120'],
        ];
    }
}
