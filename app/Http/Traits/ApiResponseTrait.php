<?php


namespace App\Http\Traits;

trait ApiResponseTrait
{
    public function handleResponse($responseObj, $message=null, $data =false)
    {
        if ($responseObj->status != 200)
            return $this->invalidResponse($responseObj->errorMessage, $responseObj->status ?? 422);

        return $this->successResponse($message, $data ? $responseObj : null);
    }

    /**
     * Invalid Request Response / Custom Validation Response
     *
     * @param string $message
     * @return \Illuminate\Http\JsonResponse
     */
    public function invalidResponse(string $message, int $code=422)
    {
        return response()->json([
            'code'      =>  $code,
            'message'  =>  $message,
            'data'      =>  null
        ], 200);
    }

    public function successResponse(string $message, $data)
    {
        return response()->json([
            'code'      =>  200,
            'message'  =>  $message,
            'data'      =>  $data
        ], 200);
    }
}
