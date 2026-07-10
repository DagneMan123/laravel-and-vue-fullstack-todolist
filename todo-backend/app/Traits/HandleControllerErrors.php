<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

trait HandleControllerErrors
{
    /**
     * Execute a callback with error handling
     * 
     * @param callable $callback
     * @param string $errorMessage
     * @param int $statusCode
     * @return mixed
     */
    protected function executeWithErrorHandling(callable $callback, string $errorMessage = 'Operation failed', int $statusCode = 500)
    {
        try {
            return $callback();
        } catch (\Exception $e) {
            Log::error($errorMessage . ': ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);
            throw $e;
        }
    }

    /**
     * Return error response
     */
    protected function errorResponse(string $message, string $error = '', int $statusCode = 500): JsonResponse
    {
        return response()->json([
            'message' => $message,
            'error' => $error ?: $message,
        ], $statusCode);
    }

    /**
     * Return success response
     */
    protected function successResponse(array $data = [], string $message = '', int $statusCode = 200): JsonResponse
    {
        $response = $data;
        if ($message) {
            $response['message'] = $message;
        }
        return response()->json($response, $statusCode);
    }
}
