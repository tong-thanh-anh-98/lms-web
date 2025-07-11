<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CourseRequest extends FormRequest
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
        $rules = [
            'title'         => 'required|string|max:255',
            'category_id'   => 'nullable|exists:categories,id',
            'level_id'      => 'nullable|exists:levels,id',
            'language_id'   => 'nullable|exists:languages,id',
            'description'   => 'nullable|string',
            'price'         => 'nullable|numeric|min:0',
            'cross_price'   => 'nullable|numeric|min:0',
            'status'        => 'integer|in:0,1',
            'is_featured'   => 'in:yes,no',
        ];

        // update function
        if ($this->isMethod('put') || $this->isMethod('patch')) {
            $rules['category_id'] = 'required|exists:categories,id';
            $rules['level_id']    = 'required|exists:levels,id';
            $rules['language_id'] = 'required|exists:languages,id';
            $rules['price']       = 'required|numeric|min:0';
        }

        return $rules;
    }
}
