<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Cors
{
    public function handle(Request $request, Closure $next): Response
    {
        // Handle preflight requests
        if ($request->isMethod('OPTIONS')) {
            return $this->handlePreflightRequest($request);
        }

        $response = $next($request);

        return $this->addCorsHeaders($response, $request);
    }

    private function handlePreflightRequest(Request $request): Response
    {
        $response = response('', 200);
        return $this->addCorsHeaders($response, $request);
    }

    private function addCorsHeaders(Response $response, Request $request): Response
    {
        $allowOrigin = $request->header('Origin') ?? '*';

        $response->headers->set('Access-Control-Allow-Origin', $allowOrigin);
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-CSRF-TOKEN, Accept');
        $response->headers->set('Access-Control-Max-Age', '86400');

        return $response;
    }
}
