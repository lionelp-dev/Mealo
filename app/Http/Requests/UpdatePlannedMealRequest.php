<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePlannedMealRequest extends FormRequest
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
            'recipe_id' => ['required', 'string', 'exists:recipes,id'],
            'meal_time_id' => ['required', 'integer', 'exists:meal_times,id'],
            'planned_date' => ['required', 'date'],
            'serving_size' => ['sometimes', 'integer:strict', 'min:1', 'max:255'],
        ];
    }
}
