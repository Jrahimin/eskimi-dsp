<?php


namespace App\Http\Traits;


use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

trait ValidationResponseTrait
{
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'code'  =>  '422',
            'message' => $validator->errors()->first(),
            'data'  => null
        ], 200));
    }
}
