<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LessonRequest extends FormRequest
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
            'title'             => 'required',
            'chapter_id'        => 'required|exists:chapters,id',
            'is_free_preview'   => 'nullable|in:yes,no',
            'duration'          => 'nullable|integer|min:0',
            'video'             => 'nullable|string|max:255',
            'description'       => 'nullable|string',
            'sort_order'        => 'nullable|integer',
            'status'            => 'integer|in:0,1',
        ];

        return $rules;
    }
}
