<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePlannedMealRequest extends FormRequest
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
            'planned_meals' => ['required', 'array'],
            'planned_meals.*.recipe_id' => ['required', 'integer', 'exists:recipes,id'],
            'planned_meals.*.meal_time_id' => ['required', 'integer', 'exists:meal_times,id'],
            'planned_meals.*.planned_date' => ['required', 'date'],
            'planned_meals.*.serving_size' => ['required', 'integer:strict', 'min:1', 'max:255'],
        ];
    }
}
