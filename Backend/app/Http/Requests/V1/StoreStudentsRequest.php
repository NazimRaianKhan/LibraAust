<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreStudentsRequest extends FormRequest
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
            // If it doesnt work change here
            'name' => ['required'],
            'department' => ['required', Rule::in(['CSE', 'EEE', 'BBA', 'ME', 'TE', 'CE', 'IPE', 'ARCH'])],
            'semester' => ['required', Rule::in(['1.1', '1.2', '2.1', '2.2', '3.1', '3.2', '4.1', '4.2'])],
            'email' => ['required', 'email', 'regex:/^[\w\.-]+@aust\.edu$/i',],
            'phone' => ['nullable'],
            'studentship' => ['required'],
            // Remember to change this later in camelcase
            'student_id' => ['required'],
            'borrowed_id' => ['nullable'],
            'password' => ['required', 'min:8', 'regex:/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/'], // Assuming borrowed_id refers to a book's id
        ];
    }

    // protection function prepareForValidation()
    // {
    //     $this->merge([
    //         'student_id' => $this->student_id
    //     ]);
    // }
}
